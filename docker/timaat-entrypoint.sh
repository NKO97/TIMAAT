#!/bin/bash
set -e

# mandatory env check
required_vars=(DATABASE_USER DATABASE_PASSWORD_FILE DATABASE_HOST DATABASE_PORT)
DATABASE_SCHEMA_NAME="fipop"

if [ -f "$DATABASE_PASSWORD_FILE" ]; then
  export DATABASE_PASSWORD=$(cat "$DATABASE_PASSWORD_FILE")
fi


for var in "${required_vars[@]}"; do
  value="${!var:-}"
  if [ -z "$value" ]; then
    echo "Error: Environment variable $var is required but not set or empty."
    exit 1
  fi
done
echo "Verify database and create or upgrade schema (if necessary)"
if [ "$(mysql -u"${DATABASE_USER}" -p"${DATABASE_PASSWORD}" -h"${DATABASE_HOST}" -P"${DATABASE_PORT}" -N -s -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DATABASE_SCHEMA_NAME}' AND table_name='db_version';")" -eq 1 ]; then
echo "Database schema already exists. Executing schema update when necessary."
  mysql -u"${DATABASE_USER}" -p"${DATABASE_PASSWORD}" -h"${DATABASE_HOST}" -P"${DATABASE_PORT}" ${DATABASE_SCHEMA_NAME} < /var/lib/timmat/sql/db_update.sql
else
   echo "Database schema doesn't exists. Executing schema creation"
   mysql -u"${DATABASE_USER}" -p"${DATABASE_PASSWORD}" -h"${DATABASE_HOST}" -P"${DATABASE_PORT}" < /var/lib/timaat/sql/fipop.sql
fi

# Here we can add timaat filesystem migration when necessary
STORAGE_LOCATION="/var/lib/timaat/storage"
STORAGE_TEMP_LOCATION="/tmp/timaat"

echo "Create necessary directories"
mkdir -p /root/.timaat
mkdir -p "${STORAGE_LOCATION}"
mkdir -p "${STORAGE_TEMP_LOCATION}"

echo "Write TIMAAT configuration file"
cat > /root/.timaat/timaat.properties <<EOF
storage.location=${STORAGE_LOCATION}
storage.temp.location=${STORAGE_TEMP_LOCATION}

database.driver=com.mysql.cj.jdbc.Driver
database.url=jdbc:mysql://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_SCHEMA_NAME}?useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&useUnicode=yes&characterEncoding=UTF-8&maxIdleTime=180&useMysqlMetadata=true
database.user=${DATABASE_USER}
database.password=${DATABASE_PASSWORD}

app.ffmpeg.location=/usr/bin/
app.imagemagick.location=/usr/bin/

app.task.maxParallelCount=${APP_TASK_MAXPARALLELCOUNT}
app.task.coreParallelCount=${APP_TASK_COREPARALLELCOUNT}
app.task.queueSize=${APP_TASK_QUEUESIZE}
EOF

echo "Starting tomcat server"
/usr/local/tomcat/bin/catalina.sh run