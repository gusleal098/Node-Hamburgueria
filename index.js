// yarn add cors -> para permitir acesso do front end

const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3001
const app = express()
app.use(express.json())

const pedidos = []

const checkPedidoId = (request, response, next) => {
    const { id } = request.params

    const index = pedidos.findIndex( pedido => pedido.id === id)

    if(index < 0){
        return response.status(404).json({ error: "Pedido not found"})
    }

    request.pedidoIndex = index
    request.pedidoId = id

    next()
}

const checkUrl = (request, response,next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

app.get('/pedidos', checkUrl, (request, response) => {
    return response.json(pedidos)
})

app.post('/pedidos', checkUrl, (request, response) => {
    const { order, name, price, status } = request.body

    const pedido = { id:uuid.v4(), order, name, price, status }
    
    pedidos.push(pedido)
    return response.status(201).json(pedido)
})

app.put('/pedidos/:id', checkPedidoId, checkUrl, (request, response) => {
    const { order, name, price, status } = request.body
    const index = request.pedidoIndex
    const id = request.pedidoId

    const updatePedido = { id, order, name, price, status }

    pedidos[index] = updatePedido

    return response.json(updatePedido)
})

app.delete('/pedidos/:id', checkPedidoId, (request, response) => {
    const index = request.findIndex

    pedidos.splice(index,1)

    return response.status(204).json()
})

app.patch('/pedidos/:id', checkPedidoId, checkUrl, (request, response) => {
    const { order, name, price } = request.body
    const index = request.pedidoIndex
    const id = request.pedidoId

    const updateStatus = {
        id,
        order: pedidos[index].order,
        name: pedidos[index].name,
        price: pedidos[index].price, 
        status: "Pronto" }

    pedidos[index] = updateStatus

    return response.json(updateStatus)
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})