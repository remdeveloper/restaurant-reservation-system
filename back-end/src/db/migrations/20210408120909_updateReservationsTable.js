exports.up = function(knex) {

    return knex.schema.alterTable('reservations', function(t) {      
         t.time("reservation_time")
         t.date("reservation_date")
         t.string("status").defaultTo("booked")
 
     })
 
 };
 
 exports.down = function(knex) {
    return knex.schema.table('reservations', function (t) {
     
         t.dropColumn("reservation_time")
         t.dropColumn("reservation_date")
  
       })
 };
 