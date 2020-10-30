// load the 4 libs
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || "";
const NEWSAPI_URL = 'http://newsapi.org/v2/top-headlines'

// create an instance of express
const app = express()

// configure handlebars
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

// configure app
app.get('/', (req, resp) => {
    resp.status(200)
    resp.type('text/html')
    resp.render('index')
})

app.get('/search', 
    async (req, resp) => {
        const search = req.query['search-term']
        const country = req.query['country']
        const category = req.query['category']

        // construct the url with the query parameters
        const url = withQuery(NEWSAPI_URL, {
            
            country: country,
            category: category,
            q: search,
            apiKey: API_KEY
        })

        const result = await fetch(url)
        const news = await result.json()

        const newsArray = news.articles
                    .map( d => {
                    return { title: d.title,
                            image : d.urlToImage ,
                            summary : d.description,
                            date : d.publishedAt,
                            link : d.url                                              
                    }
                }
            )

     resp.status(200)
        resp.type('text/html')
        lengthArray = newsArray.length
        resp.render('news', {
            search, newsArray, country, category,lengthArray,
            hasContent: lengthArray > 0
            //hasContent: !!imgs.length
        })
    }
)


app.use(express.static(__dirname + '/static'))

//run port
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)  
    console.info('API Key = ' + API_KEY)
})