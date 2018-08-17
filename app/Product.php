<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {

	protected $table = null;

        public $_id = 0;
        public $pname = '';
        public $quantityStock = '';
        public $Price = 0.00;
        public $createdOn = '';
}
