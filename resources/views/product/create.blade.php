@extends('app')

@section('content')
<div class="container-fluid">

	<div class="row">
		<div class="col-sm-12">
			<h2 id="app-title">
			<i class="fa fa-list" aria-hidden="true"></i>&nbsp;
			Haroon Store</h2>
		</div>
	</div> <!-- .row -->	

	<div class="row">
		{!! Form::open( ['url'=>'products', 'method'=>'POST' , 'id' => 'addForm']) !!}

			@include('product.form');		

		{!! Form::close() !!}	
	</div> <!-- .row -->

	 @include('product.table')

</div> <!-- container-fluid -->

@endsection