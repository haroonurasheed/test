
<div class="form-group col-sm-4">
	{!! Form::label('pname', 'Product Name: ') !!}
	{!! Form::text('pname', null, ['class' => 'form-control', 
						'required' => 'required']) !!}
</div>

<div class="form-group col-sm-3">
	{!! Form::label('quantityStock', 'Quantity in Stock: ') !!}
	{!! Form::text('quantityStock', null, ['class'=>'form-control', 
									'required'=>'required' ]) !!}
</div>

<div class="form-group col-sm-3">
	{!! Form::label('price', 'Price per Item: ') !!}
	{!! Form::text('price', null, ['class'=>'form-control', 
									'required'=>'required' ]) !!}
</div>

<div class="form-group col-sm-2">
</div>

<div class="col-sm-12 ">
	{!! Form::button( 'Add Product', ['class'=>' btn btn-primary', 'id' => 'addButton'] ) !!}
	<img id="loading-img" src="images/ajax-loader.gif" width="34" height="34" style="padding: 8px; display:none;">

	<?php $genId = MD5(uniqid()); ?>
	{!! Form::hidden('_id', $genId )  !!}
</div>		
