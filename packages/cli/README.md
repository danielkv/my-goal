# To use production data

1. Use the a service account file `service-account.cert.json`
2. Use this command to export the data from the environment you are connected:

```
npx -p node-firestore-import-export firestore-export -a service-account.cert.json -b data.json -n worksheets
```
