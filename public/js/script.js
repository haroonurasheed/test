	$(document).ready(function(){

		currentId = null;
		pname = null;
		stock = null;
		price = null;

		old_pname = null;
		old_stock = null;
		old_price = null;		

		// ------------ Submit Form -------------
		$('#addButton').click(function(){ 

			pname = $('input[name=pname]').val().trim();
			stock = $('input[name=quantityStock]').val();
			price = $('input[name=price]').val();

			// --- Validate Fields 
			if ( pname == null || pname == '' ){
				alert('Product name can not be empty');
				return false;
			}

			if ( stock != null && stock != '' ){
				if( /*isNaN(stock)*/ stock % 1 != 0 ){
					alert('Quantity Stock must be an integer number');
					return false;
				}
			}else{
				alert('Quantity Stock can not be blank ');
				return false;	  		
			}

			if ( price != null && price != '' ){
				if( isNaN(price)  ){
					alert('Price must be a number');
					return false;
				}
			}else{
				alert('Price Stock can not be blank ');
				 return false;
			}

			$('#loading-img').fadeIn(); // show loading image
			$('#addButton').addClass('disabled'); // disable button

			$.ajax({
				url: 'product',
				type: "post",
				dataType: 'JSON',
				data: {	'_id' : $('input[name=_id]').val().trim(),
						'pname' : pname, 
						'quantityStock' : stock, 
						'price' : price,
						'createdOn' : moment().format('lll'),
						'_token' : $('#addForm input[name=_token]').val()
					},
				success: function(data){
					$('#noproducts').remove();
					total = ( parseInt(data.quantityStock) * parseFloat(data.price)).toFixed(2);
					price = ( parseInt(data.price));
					$('#products-table tbody').append(
						"<tr data-id='"+data._id.trim()+"'>" +
							'<td class="pname">' + data.pname + '</td>' +
							'<td class="stock text-center">' + data.quantityStock + '</td>' +
							'<td class="price text-center">' + data.price + '</td>' +
							'<td class="text-center">' + data.createdOn + '</td>' + 						
							'<td class="total text-center">' + total + '</td>' +
							'<td class="text-center">' +
								'<a href="#" class="editProductLink" data-id="' + data._id + '"><i class="fa fa-pencil" aria-hidden="true"></i></a>&nbsp;&nbsp; ' + 
								'<a href="#" class="deleteProductLink" data-id="' + data._id + '"><i class="fa fa-trash" aria-hidden="true"></i></a> ' +
								'<a href="#" class="updateProductLink" data-id="' + data._id + '"><i class="fa fa-check" aria-hidden="true"></i></a>&nbsp;&nbsp; ' + 
								'<a href="#" class="cancelProductLink" data-id="' + data._id + '"><i class="fa fa-times" aria-hidden="true"></i></a> ' + 
							'</td>' +
						'</tr>'
					);

					// Totals
					$('#totals').remove();
					sumTotal = 0;
					total = $('.total');
					$.each( total , function( index, value ) {
						sumTotal = sumTotal + parseFloat( $(value).text() );
					});
					$('#products-table tbody').append(
						'<tr id="totals">' + 
						'<td colspan="4" style="border: none;"></td>' + 
						'<td id="sum" class="text-center" style="border: 2px solid #dddddd; font-weight: bold; font-size: 1.1em; background: #F8F8F8;">' + 
							numeral(sumTotal).format('$ 0,0.00') + '</td>' + 
						'<td style="border: none;"></td>' + 
						'</tr>'
					);

					nextId = function() {
					  return Math.random().toString(36).substr(2, 34) +
					  		Math.random().toString(36).substr(2, 34);
					};
					$('#addForm input[name=_id').val( nextId );

					$('input[name=pname]').val('');
					$('input[name=quantityStock]').val('');
					$('input[name=price]').val('');

					$('#loading-img').fadeOut(); // hide loading image
					$('#addButton').removeClass('disabled'); // enable button			
				}
			}); // $.ajax({
	    return false;
	
		}); // $('#addButton').click(function(){ 

	
		// ------------ Delete product -------------
		$('#products-table').on("click", ".deleteProductLink", function(){

			areYouSure = confirm('Are you sure?');

			if( areYouSure ){
				currentId = $(this).attr("data-id");

				$("#products-table tr[data-id='" + currentId + "']").css('background','rgba(204,204,204,0.5)');

				$.ajax({
					url: 'product',
					type: "DELETE",
					dataType: 'JSON',
					data: {	'_id' : currentId, 
							'_token' : $('#addForm input[name=_token]').val()
						},
					success: function(data){
						$("#products-table tr[data-id='" + currentId + "']").remove()

						if( $("#products-table tr[data-id]").length == 0 ){

							$('#products-table tbody').append(
								'<tr>' +
								'	<td colspan="6" class="text-center" id="noproducts">' +
								'		<h4>No products</h4>' +
								'	</td>' +
								'</tr>'
							);
							$('#totals').remove();

						}else{
							sumTotal = 0;
							total = $('.total');
							$.each( total , function( index, value ) {
								sumTotal = sumTotal + parseFloat( $(value).text() );
							});
							$('#sum').text( numeral(sumTotal).format('$ 0,0.00') );
						}
					}
				});      					
			}

			return false;

		}); // $('#products-table').on("click",


		// ------------ Edit product -------------
		$('#products-table').on("click", ".editProductLink", function(){
			
			currentId = $(this).attr("data-id");

			pname = $("#products-table tr[data-id='" + currentId + "']").find(".pname").text();
			stock = $("#products-table tr[data-id='" + currentId + "']").find(".stock").text();
			price = $("#products-table tr[data-id='" + currentId + "']").find(".price").text();

			old_pname = pname;
			old_stock = stock;
			old_price = price;

			$("#products-table tr[data-id='" + currentId + "'] .pname")
					.html('<input name="pname" id="new_pname" type="text" value="'+ pname +'" width="100%">');
			$("#products-table tr[data-id='" + currentId + "'] .stock")
					.html('<input name="stock" id="new_stock" type="text" value="'+ stock +'" width="100%">');
			$("#products-table tr[data-id='" + currentId + "'] .price")
					.html('<input name="price" id="new_price" type="text" value="'+ price +'" width="100%">');
			$(".editProductLink[data-id='" + currentId + "']").css('display','none');
			$(".deleteProductLink[data-id='" + currentId + "']").css('display','none');
			$(".updateProductLink[data-id='" + currentId + "']").css('display','inline-block');
			$(".cancelProductLink[data-id='" + currentId + "']").css('display','inline-block');

			$('#new_pname').focus();

			return false;

		}); // $('#products-table').on("click",


		// ------------ Update product -------------
		$('#products-table').on("click", ".updateProductLink", function(){
		
			//console.log(currentId);

			pname = $('#new_pname').val().trim();
			stock = $('#new_stock').val().trim();
			price = $('#new_price').val().trim();

			$('#new_pname').prop('disabled', true);
			$('#new_stock').prop('disabled', true);
			$('#new_price').prop('disabled', true);

			$("#products-table tr[data-id='" + currentId + "']").css('background','rgba(204,204,204,0.5)');

			$.ajax({
				url: 'product',
				type: "PUT",
				dataType: 'JSON',
				data: {	'_id' : currentId, 
						'pname' : pname, 
						'quantityStock' : stock, 
						'price' : price,
						'_token' : $('#addForm input[name=_token]').val()
					},
				success: function(data){
					$('#noproducts').remove();
					total = ( parseInt(data.quantityStock) * parseFloat(data.price)).toFixed(2);
					price = ( parseInt(data.price));
					$('#products-table tr[data-id="' + currentId + '"] .pname')
							.html(data.pname);
					$('#products-table tr[data-id="' + currentId + '"] .stock')
							.html(data.quantityStock);
					$('#products-table tr[data-id="' + currentId + '"] .price')
							.html(data.price);
					$('.editProductLink').css('display','inline-block');
					$('.deleteProductLink').css('display','inline-block');
					$('.updateProductLink').css('display','none');
					$('.cancelProductLink').css('display','none');

					$("#products-table tr[data-id='" + currentId + "']").css('background','#fff');

				}
			});


			return false;

		}); // $('#products-table').on("click",


		// ------------ Cancel Edit product -------------
		$('#products-table').on("click", ".cancelProductLink", function(){
			
			currentId = $(this).attr("data-id");
			console.log(currentId);

			$('#products-table tr[data-id=' + currentId + '] .pname')
					.html(old_pname);
			$('#products-table tr[data-id=' + currentId + '] .stock')
					.html(old_stock);
			$('#products-table tr[data-id=' + currentId + '] .price')
					.html(old_price);
			$('.editProductLink').css('display','inline');
			$('.deleteProductLink').css('display','inline');
			$('.updateProductLink').css('display','none');
			$('.cancelProductLink').css('display','none');

			return false;

		}); // $('#products-table').on("click",



	}); // $(document).ready(function()
