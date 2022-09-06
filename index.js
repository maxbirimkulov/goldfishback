import express from 'express'
import multer from 'multer'
import cors from 'cors'
import TelegramApi from "node-telegram-bot-api";
import mongoose from 'mongoose'
import {
    registerValidation,
    loginValidation,
    gameClientValidation, addOrderValidation
} from './validations/validations.js'
import checkAuth from "./utils/checkAuth.js";
import {
    register,
    getMe,
    login,
    getAllUser,
    handleFavorites,
    handleOrders,
    getAllOrders, handleStatus
} from './controllers/UserController.js'
import {create} from './controllers/ClothesController.js'
import handleValidatorErrors from "./utils/handleValidatorErrors.js";
import UserModel from "./models/User.js";
import {createOrder} from "./controllers/OrderController.js";


mongoose.connect('mongodb+srv://maxbirimkulov:123456goldfish@goldfish.kln5rqv.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Mongo DB успешно запущен'))
    .catch((err) =>  console.log('Ошибка при запуске Mongo DB ' ,err))


const index = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null,'uploads')
    },
    filename: (_, file, cb) => {
        cb(null,file.originalname)
    }
});

const upload = multer({storage})

index.use(express.json())
index.use(cors())
index.use('/uploads', express.static('uploads'))

const token = '5562531972:AAHr6GKdxd6jtJmew9Agnwl0qpMUkebz0BY'


export const bot = new TelegramApi(token, {polling: true})


bot.on('callback_query', async (msg) => {
    const number = msg.message.text.slice(16);
    const userId = msg.data.split(' ')[1]
    const status = msg.data.split(' ')[0]

    const user = await UserModel.findById({_id:userId })

    UserModel.findByIdAndUpdate({
        _id: userId
    },  {
        orders: user.orders.map((item) => {
            if (item.number === number){
                return {...item, status: status}
            } else {
                return item
            }
        } ),
    }, {
        returnDocument: 'after',
    }, (err, doc) => {
        if (err) {
            console.log(err)
            return bot.sendMessage(530135171, 'Не удалось подтвердить покупку')
        }
        if (!doc) {
            return bot.sendMessage(530135171, 'Юзер не найден')
        }
        bot.sendMessage(530135171, `Успешно изменен статус на ${status} у заказа под номером ${number}`)
    })
})

const PORT = process.env.PORT || 4444


index.post('/auth/login', loginValidation,handleValidatorErrors, login)
index.post('/auth/register', registerValidation,handleValidatorErrors,  register )
index.patch('/users/favorites/:id', handleFavorites)
index.get('/auth/me', checkAuth ,getMe )
index.get('/users', getAllUser)
index.patch('/users/:id', handleOrders)
index.patch('/users/status/:id', handleStatus)
index.get('/orders', getAllOrders)

index.post('/upload',  upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

// index.get('/clothes', getAll )
// index.get('/clothes/:id', getOne )
// index.delete('/clothes/:id', remove )
// index.patch('/clothes/:id', gameClientValidation, handleValidatorErrors,   update )
index.post('/cards', gameClientValidation, create )

index.post('/orders', addOrderValidation, createOrder )


index.listen(PORT, (err) => {
    if (err){
       return  console.log('Произошла ошибка', err)
    }
    console.log(`Сервер запущен на порту ${PORT}`)
})