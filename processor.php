<?php
$table = 'table';

$primaryKey = 'id';

$columns = array(
    array( 'db' => 'first_name', 'dt' => 0 ),
    array( 'db' => 'last_name',  'dt' => 1 ),
    array( 'db' => 'position',   'dt' => 2 ),
    array( 'db' => 'office',     'dt' => 3 ),
    array(
        'db'        => 'start_date',
        'dt'        => 4,
        'formatter' => function( $d, $row ) {
            return date( 'jS M y', strtotime($d));
        }
    ),
    array(
        'db'        => 'salary',
        'dt'        => 5,
        'formatter' => function( $d, $row ) {
            return '$'.number_format($d);
        }
    )
);

// SQL server connection information
$sql_details = array(
    'user' => '',
    'pass' => '',
    'db'   => '',
    'host' => ''
);

require( 'ssp.class.php' );

echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);
