const app = require('./app')
const port = process.env.PORT || 8000


async function start() {
  try {
    app.listen(port, () => {
      console.log(`---------Server has been started on ${port}----------`)
    })
  } catch(e) {
    console.log(e)
  }
}

start();      