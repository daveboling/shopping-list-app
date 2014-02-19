$(document).ready( function (){


/* HELP MENU */
//bxslider for the top div
var slider;

$(function () {

slider = $('.bxslider').bxSlider({
	infiniteLoop :  false,
	preloadimages: 'all',
});

//Hides the help menu on initial load
//$('#helpToggle').closest('.container').find('.slideDown').hide();

//Toggles the help menu using slideToggle()
$('#helpToggle').on('click', function(){
	$(this).closest('.container').find('.slideDown').slideToggle('slow');
	slider.reloadSlider();
});

});

//end help menu



//Form Area Variables
var item = $("#item");
var quantity = $("#quantity");
var price = $("#price");
var input = $('.editable');
var add = $("#add");
var editable = $(".editable");
var edit = $('.edit');
var del = $('.delete');
var list = $(".list");

//Making Quantity, Price, Editable take only numbers
//Uses jquery.numeric plugin to prevent text from being typed in the <input> fields
quantity.numeric();
price.numeric();


	//Add Button
	$(add).on('click', function (){
		//Gets the total so it can be added during the append with ease
		var totalPandQ = price.val() * quantity.val();

		//First, you need to check if the item is blank
		//Default behavior will allow an item to added with a quantity of 1 and price of 0 in case the user doesn't know what the price is. (Good call Justin)
		if (item.val() === "" || quantity.val() === ""){
			$('.error').fadeIn(400);
		}

		//Else, add the stuff yo.
		else {
			$('.error').hide();
			//Append it to the bottom of .list
			list.append('<div class="listItem"> <div class="itemType"><span class="type">' + item.val() + '</span><input class="editable" input="text"></div><div class="itemPrice"><span class="num">'+ price.val() +'</span><input class="editable" input="text"></div><div class="itemQuantity"><span class="quant">'+ quantity.val() +'</span><input class="editable" input="text"></div><div class="itemTotal">' + totalPandQ + '</div><div class="delete">Delete</div><div class="edit">Edit</div><div class="save">Save</div></div>');
		}

		//Clear old input
		item.val('');

		//Add up current total
		calcTotal();
	});

	//If enter key is pressed, adds a click event so we don't have to repeat any code
	$(document).on('keypress', function(e){
		if(e.which == 13){
			$(add).click();
		}
	});


	/* Note: on(event, selector, object handler) */
	//Delete Button
	$(document).on('click', '.delete', function () {
		$(this).closest('.listItem').queue(function() {
			$(this).find('.itemType').css('text-decoration', 'line-through');
			$(this).dequeue();
		}).queue(function () {
			$(this).fadeOut(500);
			$(this).dequeue();
		}).queue(function () {
			$(this).remove();
			$(this).dequeue();
			calcTotal();
		});	
		
	});


	//Edit Button
	$(document).on('click', '.edit', function () {

		//Step 1, 
		//Hide the boxes when in edit mode. All of your animations and aesthetics should be handled here.
		$(this).closest('.listItem').find('.edit').hide();
		$(this).closest('.listItem').find('.delete').hide();
		$(this).closest('.listItem').find('.save').show();

		//Unbinds previous hover behavior if the program is in save mode. There is no need to see edit and delete buttons.
		//Edit No Hover
		$(this).closest('.listItem').unbind('mouseenter');

		//Delete No Hover
		$(this).closest('.listItem').unbind('mouseenter');


		//Step 2
		/* We're going to leave the original value in the <input>, so we need to save them before we clear 
		them out or we can't grab the original data in edit mode. (It might annoy the user!) 

		Side note: We're converting these to numbers since they're going to be going in <input>s that only support numbers!
		*/
		var currentPrice = +($(this).closest('.listItem').find('.num').text());
		var currentQuantity = +($(this).closest('.listItem').find('.quant').text());
		var currentItem = $(this).closest('.listItem').find('.type').text();

		//Step 3
		/*Now we can clear the text to make it appear as if it were hidden, but it's not. Why didn't I use hide() you ask?
		After trial and error, I decided not to make the .editable class dynamic because of how the delegation is handled with
		the jquery.numeric plugin I am using for form validation. If I were to use hide(), the SAVE function below would not
		react properly in updating the <span> tag in the price and quantity.*/
		$(this).closest('.listItem').find('.num').text('');
		$(this).closest('.listItem').find('.quant').text('');
		$(this).closest('.listItem').find('.type').text('');


		//Step 5
		//Let's update the value with the original data AND show it at the same time! :)
		/*Ok, so this can be confusing. Let me explain how it works. We can only use closest() to find the parents. In this case
		the parents of .edit (which is .listItem). Now, we need to see the children of the item price and target the editable regions.
		This easily narrows it all down. Why didn't we skip children() and just use find()? Well, glad you asked. find() only goes a single level
		down the DOM! Meaning, we can get to .itemPrice from .listItem, but not any further. 
		*/
		$(this).closest('.listItem').children('.itemPrice').find('.editable').val(currentPrice).show();
		$(this).closest('.listItem').children('.itemPrice').find('.editable').numeric(); //Makes to where only numbers can be entered
		$(this).closest('.listItem').children('.itemQuantity').find('.editable').val(currentQuantity).show();
		$(this).closest('.listItem').children('.itemQuantity').find('.editable').numeric(); //Makes to where only numbers can be entered
		$(this).closest('.listItem').children('.itemType').find('.editable').val(currentItem).show();


		//Step 6 - Profit :)

	});

	//Save Button
	$(document).on('click', '.save', function () {

		//Hide the forms
		$(this).closest('.listItem')
		.find('.editable').hide();

		//There are no events for dynamically created elements.
		/* To explain, the code below is simply to show EDIT and DELETE upon hover, hide them when not hovering. 
		Why doesn't the CSS handle this? This is because the DOM has already loaded. It knows about what is already
		there, not what is going to be there in the future. So we must take steps to compensate for this in terms
		of dynamically created events.
		*/

		//Edit Button Hover/Leave 
		$(this).closest('.listItem').bind('mouseenter', function () {
			$(this).closest('.listItem').find('.edit').show();
		}).mouseleave(function (){
			$(this).closest('.listItem').find('.edit').hide();
		});

		//Delete Button Hover/Leave
		$(this).closest('.listItem').bind('mouseenter', function () {
			$(this).closest('.listItem').find('.delete').show();
		}).mouseleave(function (){
			$(this).closest('.listItem').find('.delete').hide();
		});

		//Hide the Save button since we're done editing
		$(this).closest('.listItem').find('.save').hide();

		//Here, change() needs to be used to detect what has changed about the current form fields
		//Since we are working with forms, we can use val() to get the values
		var newPrice = $(this).closest('.listItem').find('.itemPrice input').change();
		var newQuantity = $(this).closest('.listItem').find('.itemQuantity input').change();
		var newItem = $(this).closest('.listItem').find('.itemType input').change();
		var oldItemTotal = +($(this).closest('.listItem').find('.itemTotal').text());
		var newItemTotal = newPrice.val() * newQuantity.val();
	
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

		//New Item
		$(this).closest('.listItem')
		.find('.type')
		.text(newItem.val());

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