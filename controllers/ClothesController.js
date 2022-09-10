
import CardsModel from '../models/Clothes.js'
//
export const getAll = async (req, res) => {
    try {
        let cards ;
        if (req.query.age) {
            cards = await CardsModel.find({
                category: new RegExp(req.query.category, 'i'),
                age: {
                    $in : req.query.age.split(',')
                },
                price: {
                    $gte : req.query.from ? req.query.from : 0,
                    $lte : req.query.to ? req.query.to : 20000
                }
            });
        } else {
            cards = await CardsModel.find({
                category: new RegExp(req.query.category, 'i'),
                price: {
                    $gte : req.query.from ? req.query.from : 0,
                    $lte : req.query.to ? req.query.to : 20000
                }
            });
        }

        if (req.query.players) {
            let players = req.query.players.split('-')
            cards = cards.filter((item) => {
                return +item.playCount.split('-')[0] >= +players[0] && +item.playCount.split('-')[1] <= +players[1]
            })
        }

        if (req.query.sale){
            cards = cards.filter((item) => {
                return item.priceSale
            })
        }

        res.json(cards)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить все  статьи'
        })
    }
}
//
export const getOne = async (req, res) => {
    try {
        const cardsId = req.params.id

        CardsModel.findByIdAndUpdate({
            _id: cardsId,
        },{
            $inc: {viewsCount: 1}
        },{
            returnDocument: 'after',
        }, (err, doc) => {
            if (err) {
                console.log(err)
               return  res.status(500).json({
                    message: 'Не удалось получить статью'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }

            res.json(doc)
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить все  статьи'
        })
    }
}
//
export const remove = async (req, res) => {
    try {
        const cardsId = req.params.id
        CardsModel.findByIdAndDelete({
            _id: cardsId
        }, (err, doc) => {
            if (err){
                console.log(err)
                return  res.status(500).json({
                    message: 'Не удалось удалить вещь'
                })
            }

            if (!doc){
                return res.status(404).json({
                    message: 'Вещь не найдена'
                })
            }

            res.json({success: true})
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить'
        })
    }
}
//
export const create =  async (req, res) => {
    try {
        const doc = new CardsModel({
            title: req.body.title,
            price : req.body.price,
            priceSale : req.body.priceSale,
            images: req.body.images,
            category: req.body.category,
            time: req.body.time,
            age: req.body.age,
            playCount: req.body.playCount,
        })
        const cards = await doc.save()
        res.json(cards)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать карточку'
        })
    }
}
//
// export const update =  async (req, res) => {
//     try {
//         const clothesId = req.params.id
//
//         await ClothesModel.updateOne({
//             _id: clothesId
//         }, {
//             title: req.body.title,
//             price : req.body.price,
//             priceSale : req.body.priceSale,
//             gender : req.body.gender,
//             images: req.body.images,
//             colors: req.body.colors,
//             category: req.body.category,
//             inStock: req.body.inStock
//         })
//         res.json({success: true})
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось обновить статью'
//         })
//     }
// }