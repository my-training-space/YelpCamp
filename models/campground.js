const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema; //to shorten code

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ geometry: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}); 
  
CampgroundSchema.post('findOneAndDelete', async function (deletedDocument) {
    if(deletedDocument){
        await Review.remove({
            _id: {
                $in: deletedDocument.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);