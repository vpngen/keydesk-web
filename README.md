# Keydesk start


## Ubuntu 20+ (WSL2 Ok)
```
install postgresql
service postgresql start
```
## Init:
```
./keys/000-create
./keys/001-init
./keys/002-feel
./keys/003-role
```
## Start:
```
./keys/keydesk -id GMXNI523PJFD7A36I7T5MKZ524 -l 127.0.0.1:8080 -c ./ -w ./dist
```

---

# Vpn-profile spa

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
