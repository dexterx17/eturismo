# deploy

Build single container
``` 

    docker build . -t node-wao
    docker run --name n-wao -p 3000:3000 node-wao 
    
    docker volume create wao-vol
    docker run --name n-wao -p 3000:3000 --mount source=/,target=/usr/src/app node-wao 

```
Access to container console
``` docker exec -it n-wao bash ```


Build orchest container (docker-compose.yaml)

``` 
    docker-compose up --build
```
