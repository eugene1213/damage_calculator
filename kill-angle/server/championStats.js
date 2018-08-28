var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var championStatsSchema = new Schema({
    _id: Schema.Types.ObjectId,    
    id: Number,
    armor: Number,
    armorperlevel: Number,    
    attackdamage: Number,
    attackdamageperlevel: Number,
    attackspeedoffset: Number,
    attackspeedperlevel: Number,
    hp: Number,
    hpperlevel: Number,
    key: String,    
    movespeed: Number,    
    mp: Number,
    mpperlevel: Number,
    name: String,    
    spellblock: Number,
    spellblockperlevel: Number
}, { collection: "championStats" });

module.exports = mongoose.model('championStats', championStatsSchema);