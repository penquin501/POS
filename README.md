# Parcel 2019

## example working space  

    # docker-compose.yml
    version: "3.0"
    services:
      mysql:
        image: mysql
      webapp:
        build:
          context: ./parcel_2019
        environment:
          - MYSQL_HOST=mysql
          - MYSQL_USERNAME=root
          - MYSQL_PASSWORD=password
          - MYSQL_DATABASE_NAME=parcel
        ports:
          - "3355:3000"
