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
        ports:
        - "3355:3000"
