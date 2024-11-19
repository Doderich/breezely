https://thingsboard.io/docs/user-guide/install/docker/

## Init directories

```
mkdir -p ./volumes/.mytb-data && sudo chown -R 799:799 ./volumes/.mytb-data
mkdir -p ./volumes/.mytb-logs && sudo chown -R 799:799 ./volumes/.mytb-logs
```

## Default users
- System Administrator: sysadmin@thingsboard.org / sysadmin
- Tenant Administrator: tenant@thingsboard.org / tenant
- Customer User: customer@thingsboard.org / customer
