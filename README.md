# deploy

Build single container
``` 
    docker build . -t node-wao
    docker run -p 3000:3000 node-wao
```

Build orchest container

``` 
    docker-compose up --build
```

Access to container console
``` docker exec node-wao bash ```
