$(document).ready( function (){
//Set your variables, you will be reusing these and it will be less confusing

//Form Area
var item = $("#item");
var quantity = $("#quantity");
var price = $("#price");
var input = $('.editable'); //Not functional
var add = $("#add");
var editable = $(".editable");

//List Area
var list = $(".list");
//var testDiv = $(".title"); //For debugging

//Making Quantity, Price, Editable take only numbers
//Uses jquery.numeric plugin
editable.numeric();
quantity.numeric();
price.numeric();



	//Add Button
	$(add).on('click', function (){ 
		//Get a current total for the append
		var totalPandQ = price.val() * quantity.val();


		//First, you need to check if the forms are blank!
		if (item.val() === "" || quantity.val() === ""){
		}

		//Else, add the stuff yo.
		else {
			//Add it to HTML
			list.append('<div class="listItem"> ' + item.val() + '<div class="itemPrice"><span class="num">3</span><input class="editable" input="text"></div><div class="itemQuantity"><span class="quant">3</span><input class="editable" input="text"></div><div class="itemTotal">' + totalPandQ + '</div><div class="delete">Delete</div><div class="edit">Edit</div><div class="save">Save</div></div>');
		}

		//Add up current total
		calcTotal();
	});


	/* Note: on(event, selector, object handler) */
	//Delete Button
	$(document).on('click', '.delete', function () {
		$(this).closest('.listItem').remove();
		calcTotal();
	});


	//Edit Button
	$(document).on('click', '.edit', function () {
		$(this).closest('.listItem').find('.edit').hide();
		$(this).closest('.listItem').find('.delete').hide();
		$(this).closest('.listItem').find('.save').show();

		//Using text() here since we are dealing with divs, probably something better to be used
		//here, but it works like I want it to.
		var currentPrice = +($(this).closest('.listItem').find('.num').text());
		var currentQuantity = +($(this).closest('.listItem').find('.quant').text());

		//Hide Price
		$(this).closest('.listItem')
		.find('.num').text('');
		$(this).closest('.listItem')
		.find('.quant').text('');

		//Show Price Edit Box
		$(this).closest('.listItem')
		.find('.editable').val(currentPrice).show();
	});

	//Save Button
	$(document).on('click', '.save', function () {

		//Hide and show selected buttons
		$(this).closest('.listItem').find('.edit').show();
		$(this).closest('.listItem').find('.delete').show();
		$(this).closest('.listItem').find('.save').hide();

		//Hide the forms
		$(this).closest('.listItem')
		.find('.editable').hide();

		//Here, change() needs to be used to detect what has changed about the current form fields
		//Since we are working with forms, we can use val() to get the values
		var newPrice = $(this).closest('.listItem').find('.itemPrice input').change();
		var newQuantity = $(this).closest('.listItem').find('.itemQuantity input').change();
		var oldItemTotal = +($(this).closest('.listItem').find('.itemTotal').text());
		var newItemTotal = newPrice.val() * newQuantity.val();
	

		/* Note, I made the text() blank in these spans
		   so that hide() wouldn't save the Save button
		   to show blank text as if the span had been deleted.
		*/


		//New Price
		$(this).closest('.listItem')
		.find('.num')
		.text(newPrice.val());

		//New Quantity
		$(this).closest('.listItem')
		.find('.quant')
		.text(newQuantity.val());

		//New Total
		$(this).closest('.listItem')
		.find('.itemTotal')
		.html(newItemTotal);

		//Add total
		calcTotal();


	});

function calcTotal() {
	var overallTotal = 0;
//Adds all current total of listItem everytime a change is made to price!
		$('.list .listItem .itemTotal').each(function (){
		overallTotal += +($(this).text());

		});

		$('#allItemTotals').text(overallTotal);
}

calcTotal();

});