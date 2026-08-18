#!/usr/bin/env bash
#
# setup.sh
# Prépare le fichier .env avant le premier "docker compose up" :
# - Si .env n'existe pas, demande interactivement les secrets (ou en génère).
# - Si le volume MySQL existe déjà, prévient que MYSQL_ROOT_PASSWORD ne sera
#   pas appliqué (MySQL ne lit cette variable qu'à l'initialisation d'un volume
#   vide) — évite un backend qui crash-loop en silence sur une auth refusée.

set -euo pipefail

ENV_FILE=".env"
VOLUME_NAME="ipssi_patch_mysql_data"

if [[ -f "$ENV_FILE" ]]; then
  echo "==> $ENV_FILE existe déjà, rien à faire."
else
  echo "==> Aucun $ENV_FILE trouvé — configuration initiale."

  read -r -p "Mot de passe root MySQL (laisser vide pour en générer un aléatoire) : " MYSQL_PW
  if [[ -z "$MYSQL_PW" ]]; then
    MYSQL_PW=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
    echo "    Mot de passe généré."
  fi

  read -r -p "JWT_SECRET (laisser vide pour en générer un aléatoire) : " JWT_SECRET
  if [[ -z "$JWT_SECRET" ]]; then
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    echo "    Secret généré."
  fi

  cat > "$ENV_FILE" <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_PW}
JWT_SECRET=${JWT_SECRET}
EOF
  echo "==> $ENV_FILE créé."
fi

if docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
  echo ""
  echo "⚠️  Le volume MySQL '$VOLUME_NAME' existe déjà."
  echo "    MYSQL_ROOT_PASSWORD dans $ENV_FILE ne sera PAS appliqué (MySQL ne lit"
  echo "    cette variable qu'à l'initialisation d'un volume vide) — la base"
  echo "    utilisera encore l'ancien mot de passe. Si 'docker compose up' échoue"
  echo "    avec une erreur d'authentification backend <-> MySQL, aligne les deux :"
  echo ""
  echo "    docker compose exec db mysql -uroot -p'<ANCIEN_MOT_DE_PASSE>' \\"
  echo "      -e \"ALTER USER 'root'@'%' IDENTIFIED BY '\$(grep MYSQL_ROOT_PASSWORD $ENV_FILE | cut -d= -f2)';\""
  echo ""
fi

echo "==> Prêt : docker compose up -d --build"
