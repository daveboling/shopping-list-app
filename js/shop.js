$(document).ready( function (){

//Form Area Variables
var item = $("#item");
var quantity = $("#quantity");
var price = $("#price");
var input = $('.editable');
var add = $("#add");
var editable = $(".editable");

//List Area
var list = $(".list");
//var testDiv = $(".title"); //For debugging

//Making Quantity, Price, Editable take only numbers
//Uses jquery.numeric plugin to prevent text from being typed in the <input> fields
editable.numeric();
quantity.numeric();
price.numeric();



	//Add Button
	$(add).on('click', function (){ 
		//Gets the total so it can be added during the append with ease
		var totalPandQ = price.val() * quantity.val();

		//First, you need to check if the item is blank
		//Default behavior will allow an item to added with a quantity of 1 and price of 0 in case the user doesn't know what the price is. (Good call Justin)
		if (item.val() === "" || quantity.val() === ""){
		}

		//Else, add the stuff yo.
		else {
			//Append it to the bottom of .list
			list.append('<div class="listItem"> ' + item.val() + '<div class="itemPrice"><span class="num">'+ price.val() +'</span><input class="editable" input="text"></div><div class="itemQuantity"><span class="quant">'+ quantity.val() +'</span><input class="editable" input="text"></div><div class="itemTotal">' + totalPandQ + '</div><div class="delete">Delete</div><div class="edit">Edit</div><div class="save">Save</div></div>');
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

		//Step 1, 
		//Hide the boxes when in edit mode. All of your animations and aesthetics should be handled here.
		$(this).closest('.listItem').find('.edit').hide();
		$(this).closest('.listItem').find('.delete').hide();
		$(this).closest('.listItem').find('.save').show();


		//Step 2
		/* We're going to leave the original value in the <input>, so we need to save them before we clear 
		them out or we can't grab the original data in edit mode. (It might annoy the user!) 

		Side note: We're converting these to numbers since they're going to be going in <input>s that only support numbers!
		*/
		var currentPrice = +($(this).closest('.listItem').find('.num').text());
		var currentQuantity = +($(this).closest('.listItem').find('.quant').text());

		//Step 3
		/*Now we can clear the text to make it appear as if it were hidden, but it's not. Why didn't I use hide() you ask?
		After trial and error, I decided not to make the .editable class dynamic because of how the delegation is handled with
		the jquery.numeric plugin I am using for form validation. If I were to use hide(), the SAVE function below would not
		react properly in updating the <span> tag in the price and quantity.*/
		$(this).closest('.listItem').find('.num').text('');
		$(this).closest('.listItem').find('.quant').text('');


		//Step 5
		//Let's update the value with the original data AND show it at the same time! :)
		/*Ok, so this can be confusing. Let me explain how it works. We can only use closest() to find the parents. In this case
		the parents of .edit (which is .listItem). Now, we need to see the children of the item price and target the editable regions.
		This easily narrows it all down. Why didn't we skip children() and just use find()? Well, glad you asked. find() only goes a single level
		down the DOM! Meaning, we can get to .itemPrice from .listItem, but not any further. 
		*/
		$(this).closest('.listItem').children('.itemPrice').find('.editable').val(currentPrice).show();
		$(this).closest('.listItem').children('.itemQuantity').find('.editable').val(currentQuantity).show();

		//Step 6 - Profit :)

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