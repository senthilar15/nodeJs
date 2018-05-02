var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date}
  }
);

// Virtual for author's full name
AuthorSchema.virtual('name')
            .get(function () {
                     return this.family_name + ', ' + this.first_name;
                });

// Virtual for author's URL
AuthorSchema.virtual('url')
            .get(function () {
                    return '/catalog/author/' + this._id;
            });

            // Virtual for bookinstance's URL
AuthorSchema
.virtual('date_birth')
.get(function () {
    return this.date_of_birth ?  moment(this.date_of_birth).format('MMMM Do, YYYY') : this.date_of_birth ;
});
//Export model
module.exports = mongoose.model('Author', AuthorSchema);