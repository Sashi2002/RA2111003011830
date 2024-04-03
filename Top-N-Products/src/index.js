const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000

// Mock token for demonstration purposes
const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTU1MjEyLCJpYXQiOjE3MTIxNTQ5MTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjIzZGQ3MTUzLTk2YmEtNDhmZC05NDAwLTlmZGIyMGFlMjhlYSIsInN1YiI6InNtODE2OEBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIyM2RkNzE1My05NmJhLTQ4ZmQtOTQwMC05ZmRiMjBhZTI4ZWEiLCJjbGllbnRTZWNyZXQiOiJaeXZ6alBGSHZuZXlWa1hyIiwib3duZXJOYW1lIjoiU2FzaGlrYW50YSBNb2hhbnR5Iiwib3duZXJFbWFpbCI6InNtODE2OEBzcm1pc3QuZWR1LmluIiwicm9sbE5vIjoiUkEyMTExMDAzMDExODMwIn0.8OMTcwCMuOX_M_TXrXjZ34Ftr72Q9PUAtvyaMBG6hA0'

// Function to make a request to the test server API
const fetchProducts = async (
    companyName,
    categoryName,
    topN,
    minPrice,
    maxPrice,
    sort
) => {
    try {
        const response = await axios.get(
            `http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`,
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        )

        // Sort products based on the specified sorting method
        const sortedProducts = response.data.sort((a, b) => {
            switch (sort) {
                case 'rating':
                    return b.rating - a.rating
                case 'discount':
                    return b.discount - a.discount
                case 'price':
                    return a.price - b.price
                default:
                    return 0
            }
        })

        return sortedProducts
    } catch (error) {
        console.error('Error fetching products:', error.response.data)
        throw new Error('Failed to fetch products')
    }
}

// Route to get top products within a category
app.get('/categories/:categoryName/products', async (req, res) => {
    const { categoryName } = req.params
    const { topN = 10, minPrice = 0, maxPrice = Infinity, sort } = req.query
    const page = parseInt(req.query.page) || 1

    try {
        const products = await fetchProducts(
            'AMZ',
            categoryName,
            topN,
            minPrice,
            maxPrice,
            sort
        )

        // Pagination logic
        const startIndex = (page - 1) * topN
        const endIndex = startIndex + parseInt(topN)
        const paginatedProducts = products.slice(startIndex, endIndex)

        res.json(paginatedProducts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Route to get details of a specific product
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const { categoryName, productId } = req.params

    try {
        const products = await fetchProducts(
            'AMZ',
            categoryName,
            1,
            0,
            Infinity
        )
        const product = products.find((p) => p.productId === productId)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
