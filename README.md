# deploy

Build single container
``` 
    docker build . -t node-wao
    docker run -t n-wao -p 3000:3000 node-wao 
```
Access to container console
``` docker exec -it n-wao bash ```


Build orchest container (docker-compose.yaml)

``` 
    docker-compose up --build
```
