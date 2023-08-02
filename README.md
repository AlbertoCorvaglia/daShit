
# daShit

Minimal Dashboard with admin authentication to monitor your server real time statistics.




## Deployment

To deploy this project run in the daShit directory:

```bash
cd daShit/
chmod +x start.sh #get permission to execute
./start.sh #starts daShit
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`ADMIN_USER`

`ADMIN_PASSWORD`


## API Reference

#### Get Statistic

```http
  GET /api/
```

| JWT | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `cookie` | `string` | **Required**. Log In cookie |

## Author

- [@AlbertoCorvaglia](https://www.github.com/octokatherine)


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

