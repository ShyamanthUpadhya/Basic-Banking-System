const mysql = require('mysql');

const pool =mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME 
});


exports.view = (req,res) => {

    pool.getConnection((err, connection) => {
        if(err)throw err;
        console.log('Connection as ID '+connection.threadId);

        connection.query('SELECT * FROM user',(err, rows) => {
            connection.release();

            if(!err){
                res.render('home',{rows});
            }
            else{
                console.log(err);
            }
        })


    });
}

exports.trans = (req,res) => {

    pool.getConnection((err, connection) => {
        if(err)throw err;
        console.log('Connection as ID '+connection.threadId);

        connection.query('SELECT * FROM transcation',(err, rows) => {
            connection.release();

            if(!err){
                res.render('transcation',{rows});
            }
            else{
                console.log(err);
            }
        })


    });
}

exports.mon = (req,res) => {
    res.render('transfer');
}


exports.form = (req,res) => {
    let sen_amt;
    let rec_amt;
    const {sender_name, receive_name, amt} = req.body;
    pool.getConnection((err,connection) => {
        if (err) throw err;
        console.log('Connection ID '+connection.threadId);

        connection.query('SELECT * FROM user WHERE name = ?',[sender_name],(err,row1) => {
        connection.release();
        sen_amt=row1[0]["balance"]-amt;
        pool.getConnection((err,connection) => {
            connection.query('UPDATE user SET balance = ? WHERE name = ?',[sen_amt,sender_name],(err,row2) => {
                connection.release();
                console.log(row2);
            });
        })
        });
       
    });
    pool.getConnection((err,connection) => {
        if (err) throw err;
        console.log('Connection ID '+connection.threadId);

        connection.query('SELECT * FROM user WHERE name = ?',[receive_name],(err,row3) => {
        connection.release();
        rec_amt=parseInt(row3[0]["balance"])+parseInt(amt);
        pool.getConnection((err,connection) => {
            connection.query('UPDATE user SET balance = ? WHERE name = ?',[rec_amt,receive_name],(err,row4) => {
                connection.release();
                console.log(row4);
            });
        });
        });
       
    });
    pool.getConnection((err, connection) => {
        if(err)throw err;
        console.log('Connection as ID '+connection.threadId);

        connection.query('INSERT INTO transcation VALUES(?,?,?)',[sender_name, receive_name, amt],(err, rows5) => {
            connection.release();

            if(!err){
                pool.getConnection((err, connection) => {
                    if(err)throw err;
                    console.log('Connection as ID '+connection.threadId);
            
                    connection.query('SELECT * FROM transcation',(err, rows) => {
                        connection.release();
            
                        if(!err){
                            res.render('transcation',{rows});
                        }
                        else{
                            console.log(err);
                        }
                    })
            
            
                });
            }
            else{
                console.log(err);
            }
        })


    });
    

}


