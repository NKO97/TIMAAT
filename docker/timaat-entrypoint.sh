#!/bin/bash
set -e

# mandatory env check
required_vars=(DATABASE_USER DATABASE_PASSWORD DATABASE_HOST DATABASE_PORT DATABASE_SCHEMA_NAME)

for var in "${required_vars[@]}"; do
  value="${!var:-}"
  if [ -z "$value" ]; then
    echo "Error: Environment variable $var is required but not set or empty."
    exit 1
  fi
done
echo "Verify database and upgrade schema (if necessary)"
mysql -u"${DATABASE_USER}" -p"${DATABASE_PASSWORD}" -h"${DATABASE_HOST}" -P"${DATABASE_PORT}" "${DATABASE_SCHEMA_NAME}" < /var/lib/timmat/sql/db_update.sql


# Here we can add timaat filesystem migration when necessary

echo "Create necessary directories"
mkdir /root/.timaat

echo "Write TIMAAT configuration file"
cat > /root/.timaat/timaat.properties <<EOF
storage.location=${STORAGE_LOCATION}
storage.temp.location=${STORAGE_TEMP_LOCATION}

database.driver=com.mysql.cj.jdbc.Driver
database.url=jdbc:mysql://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_SCHEMA_NAME}?useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&useUnicode=yes&characterEncoding=UTF-8&maxIdleTime=180&useMysqlMetadata=true
database.user=${DATABASE_USER}
database.password=${DATABASE_PASSWORD}

app.ffmpeg.location=/usr/bin
app.imagemagick.location=/usr/bin

app.task.maxParallelCount=${APP_TASK_MAXPARALLELCOUNT}
app.task.coreParallelCount=${APP_TASK_COREPARALLELCOUNT}
app.task.queueSize=${APP_TASK_QUEUESIZE}
EOF

echo "Starting tomcat server"
/usr/local/tomcat/bin/catalina.sh run