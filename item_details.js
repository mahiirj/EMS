const mongoose = require("mongoose");

const item_Counter = require('./item_counter');



// Subpart Schema

const subpartSchema = new mongoose.Schema({

    name: { type: String, required: true },
    price: { type: Number, required: true },

});

// Item Schema

const itemSchema = new mongoose.Schema({

    name: { type: String, required: true },
    subparts: [subpartSchema] ,// Array of subparts
    itemID:{type:String, require: true},
    itemStatus:{type:String, required: true}

});





// Pre-save hook to generate item ID before saving

itemSchema.pre('save', async function (next) {

    const doc = this;

    if (this.isNew) { // Only generate ID if the document is new
        try {
            const counter = await item_Counter.findByIdAndUpdate(
                { _id: 'itemID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            doc.itemID = `I${counter.seq}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        // If the document is not new, proceed without changing the ID
        next();
    }
});




const Item = mongoose.model('item_details', itemSchema);

const Subpart = mongoose.model('subpart_details', subpartSchema);

module.exports = { Item, Subpart };
