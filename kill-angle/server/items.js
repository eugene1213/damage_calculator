var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id: Number,
    FlatMagicDamageMod: Number,
    armor: Number,
    attackdamage: Number,    
    attackspeedoffset: Number,
    hp: Number,    
    movespeed: Number,
    mp: Number,    
    name: String,    
    spellblock: Number,
    isEffectiveStats: Boolean
});

module.exports = mongoose.model('items', itemsSchema);