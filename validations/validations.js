import {body} from "express-validator";

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('login', 'Укажите Логин').isLength({min: 3}),
    body('phone', 'Укажите номер телефона').isLength({min: 12}),
    body('orders','Неверный список заказов').optional().isString(),
    body('favorites','Неверный список избранных').optional().isString(),
]

export const gameClientValidation = [
    body('title', 'Введите название товара').isLength({min: 3}).isString(),
    body('price', 'Введите цену товара').isNumeric(),
    body('priceSale', 'Введите аукционную цену товара').optional().isNumeric(),
    body('images', 'Неверный формат картинок (укажите массив)').optional().isString(),
    body('category', 'Введите категорию').isString(),
    body('time', 'Введите время').isString(),
    body('age', 'Введите возраст').isNumeric(),
    body('playCount', 'Введите количество игроков').isString(),
]

export const addOrderValidation = [
    body('name', 'Введите ваше имя').isLength({min: 3}).isString(),
    body('surname', 'Введите ваше фамилие').isLength({min: 3}).isString(),
    body('email', 'Введите ваш email').isLength({min: 3}).isEmail(),
    body('phone', 'Введите ваш номер телефона').isLength({min: 12}),
    body('orders', 'Сделайте покупку').isArray(),
]

