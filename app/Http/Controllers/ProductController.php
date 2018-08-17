<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

use App\Product;
use Request;

use File;

class ProductController extends Controller {

	/**
	 * Create a new SongController instance.
	 *
	 * @return void
	 */
	public function __construct()
	{

	}

	/**
	 * Show all products (GET).
	 *
	 * @return Response
	 */
	public function index()
	{
		return "Nothing to see here...";
	}

	/**
	 * Show form to add a new product (GET).
	 *
	 * @return Response
	 */
	public function create()
	{
		$products = null;
		if ( File::exists('generatedfiles/products.json') ){
			$products = json_decode(file_get_contents('generatedfiles/products.json'));
			if( $products ){
				$products = $products->products;
			}else{
				$products = null;							
			}
		}else{
			$products = json_decode('{"products":[]}');
			$products = null;			
		}
		$product = new Product();
		return view('product.create', compact('products','product'));
	}

	/**
	 * Submit form to store a new products (POST).
	 *
	 * @return Response
	 */
	public function store()
	{
		$request = Input::except('_token');

		//dd($request);

		if(Request::ajax()) {
			if ( ! file_exists('generatedfiles') ) {
			    mkdir('generatedfiles', 0777, true);
			}
			if ( ! File::exists('generatedfiles/products.json') ){
				file_put_contents("generatedfiles/products.json", 
					'{"products":[' . json_encode($request) . ']}' );
				return response()->json($request);
			}else{
				$products = json_decode(file_get_contents('generatedfiles/products.json'));

				$newProduct = $request;

				$products->products[] = $newProduct;

				File::put('generatedfiles/products.json',
							json_encode( $products ));

				return response()->json($request);
			}
		}
	}	

	/**
	 * Show form to edit a product.(GET)
	 *
	 * @return Response
	 */
	public function edit()
	{
		return view('product.edit');
	}

	/**
	 * Sumit form to edit a product.(PUT / PATCH)
	 *
	 * @return Response
	 */
	public function update()
	{

		if(Request::ajax()) {
			$products = json_decode(file_get_contents('generatedfiles/products.json'), true);

			$post = 0;
			foreach($products['products'] as $product)
			{
			    if( $product['_id'] == Input::get('_id') )
			    {
			        break;
			    }
			    $post ++;			    	
			}

			$products['products'][$post]['pname'] = Input::get('pname');
			$products['products'][$post]['price'] = Input::get('price');	
			$products['products'][$post]['quantityStock'] = Input::get('quantityStock');

			File::put('generatedfiles/products.json',
						json_encode( $products ));			
			
			return response()->json($products['products'][$post]);
		}

	}	

	/**
	 * Delete a product (DELETE).
	 *
	 * @return Response
	 */
	public function delete()
	{
		if(Request::ajax()) {
			$products = json_decode(file_get_contents('generatedfiles/products.json'),true);

			$post = 0;
			foreach($products['products'] as $product)
			{
			    if( $product['_id'] == Input::get('_id') )
			    {
			        break;
			    }
			    $post ++;			    	
			}

			if($post ==0){
				$products = json_decode('{"products":[]}');
				File::put('generatedfiles/products.json',
							json_encode( $products ));	
			}else{
				unset( $products['products'][$post] );
				File::put('generatedfiles/products.json',
							json_encode( $products ));
			}			
			
			return response()->json($products);
		}
	}	

}
