exports.up = function(knex) {

   return knex.schema.alterTable('reservations', function(t) {
        t.string("first_name", null).notNullable()
        t.string("last_name").notNullable()
        t.string("mobile_number")
        t.integer("people")

    })

};

exports.down = function(knex) {
   return knex.schema.table('reservations', function (t) {
        t.dropColumn("first_name")
        t.dropColumn("last_name")
        t.dropColumn("mobile_number")
        t.dropColumn("people")
 
      })
};
