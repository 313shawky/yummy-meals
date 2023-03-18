$(function () {
    $('.nav-items-details').children().hide();
    $('#loading').fadeOut(1500, function(){
        $('body').css('overflow', 'auto');
    });

    let navWidth = $('.inner-nav').innerWidth();
    $('nav').css('left', -navWidth);
    $('#nav-exit').hide();
    $('#nav-menu').show();

    function animateNav(){
        $('#nav-exit').hide();
        $('#nav-menu').show();
        $('nav').animate({left: -navWidth}, 500);
    }


    let listHeight = $('.nav-items ul').innerHeight();
    $('.nav-items ul li').css('top', listHeight);

    $('#nav-menu').click(function(){
        $('#nav-menu').hide();
        $('#nav-exit').show();
        $('nav').animate({left: 0}, 500);
        for (let i = 0; i < 5; i++) {
            $(".nav-items ul li").eq(i).animate({top: 0}, (i + 5) * 100);
        }
    })

    $('#nav-exit').click(function(){
        $('#nav-exit').hide();
        $('#nav-menu').show();
        $('nav').animate({left: -navWidth}, 500);
        for (let i = 4; i >= 0; i--) {
            $(".nav-items ul li").eq(i).animate({top: listHeight}, (i + 5) * 100);
        }
    })

    getMeals('search.php?s=');

    async function getMeals(meal){
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/${meal}`);
        let result = await apiResponse.json();
        displayMeals(result.meals);
        $('#meals-items').children().click(async function(){
            displayLoading();
            let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${$(this).attr('id')}`);
            let result = await apiResponse.json();
            animateNav();
            $('.meals').hide();
            $('.search').hide();
            $('.details').show();
            displayMealDetails(result.meals[0]);
        });
    }

    function displayMeals(arr){
        var box = ``;
        for(let i = 0; i < arr.length; i++){
            box += `<div id="${arr[i].idMeal}" class="col-md-3">
                        <div class="item position-relative overflow-hidden rounded-2">
                            <img class="w-100" src=${arr[i].strMealThumb} alt="">
                            <div class="item-layer d-flex align-items-center w-100 h-100 position-absolute">
                                <h3 class="ps-2">${arr[i].strMeal}</h3>
                            </div>
                        </div>
                    </div>`
        }
        $('#meals-items').html(box);
    }

    function displayMealDetails(meal){
        var box = `<div class="col-md-4">
                        <img class="w-100 rounded-3" src=${meal.strMealThumb} alt="">
                        <h2>${meal.strMeal}</h2>
                    </div>
                    <div class="col-md-8">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <h3>Area : ${meal.strArea}</h3>
                        <h3>Category : ${meal.strCategory}</h3>
                        <h3>Recipes :</h3>
                        <div id="recipes" class="mb-3 d-flex flex-wrap"></div>
                        <h3>Tags :</h3>
                        <div id="tags" class="mb-3 d-flex flex-wrap"></div>
                        <a class="btn btn-success" href="${meal.strSource}" target="_blank">Source</a>
                        <a class="btn btn-danger" href="${meal.strYoutube}" target="_blank">Youtube</a>
                    </div>`;
        $('#meal').html(box);

        let mealMap = new Map(Object.entries(meal));
        for(let i = 1; i < 20; i++){
            if(mealMap.get('strIngredient' + i) !== "" && mealMap.get('strIngredient' + i) !== null){
                $('#recipes').append(`<span class="alert alert-info p-1 m-2">${mealMap.get('strMeasure' + i)} ${mealMap.get('strIngredient' + i)}</span>`)
            }
            else{
                continue;
            }
        }

        if(meal.strTags !== null){
            let mealTags = meal.strTags.split(",");
            for(let tag of mealTags){
                $('#tags').append(`<span class="alert alert-danger p-1 m-2">${tag}</span>`);
            }
        }
    }



    async function getCategories(){
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let result = await apiResponse.json();
        displayCategories(result.categories);
        $('#categories-items').children().click(getCategoryDetails);
    }

    function getCategoryDetails(){
        getMeals(`filter.php?c=${$(this).attr('category')}`);
        $('.categories').hide();
        $('.meals').show();
    }

    function displayCategories(arr){
        var box = ``;
        for(let i = 0; i < arr.length; i++){
            box += `<div category="${arr[i].strCategory}" class="col-md-3">
                        <div class="item position-relative overflow-hidden rounded-2">
                            <img class="w-100" src=${arr[i].strCategoryThumb} alt="">
                            <div class="item-layer w-100 h-100 position-absolute text-center p-2 rounded-2 overflow-hidden">
                                <h3>${arr[i].strCategory}</h3>
                                <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                            </div>
                        </div>
                    </div>`
        }
        $('#categories-items').html(box);
    }

    async function getArea(){
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let result = await apiResponse.json();
        displayArea(result.meals);
        $('#area-items').children().click(getAreaDetails);
    }

    function getAreaDetails(){
        getMeals(`filter.php?a=${$(this).attr('area')}`);
            $('.area').hide();
            $('.meals').show();
    }

    function displayArea(arr){
        var box = ``;
        for(let i = 0; i < arr.length; i++){
            box += `<div area="${arr[i].strArea}" class="col-md-3">
                        <div class="item text-white text-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${arr[i].strArea}</h3>
                        </div>
                    </div>`
        }
        $('#area-items').html(box);
    }

    async function getIngredients(){
        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let result = await apiResponse.json();
        displayIngredients(result.meals);
        $('#ingredients-items').children().click(getIngredientDetails);
    }

    function getIngredientDetails(){
        getMeals(`filter.php?i=${$(this).attr('ingredients')}`);
        $('.ingredients').hide();
        $('.meals').show();
    }

    function displayIngredients(arr){
        var box = ``;
        for(let i = 0; i < 20; i++){
            box += `<div ingredients=${arr[i].strIngredient} class="col-md-3">
                        <div class="item text-white text-center">
                            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h3>${arr[i].strIngredient}</h3>
                            <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                        </div>
                    </div>`
        }
        $('#ingredients-items').html(box);
    }

    $('.nav-items ul').children().click(function(){
        $('.meals').hide();
        $('.details').hide();
        for (let i = 4; i >= 0; i--) {
            $(".nav-items ul li").eq(i).animate({top: listHeight}, (i + 5) * 100);
        }
        animateNav();
    })

    $('#search').click(function(){
        $('.nav-items-details .search').siblings().hide();
        $('.nav-items-details .search').show();
    })

    $('#name-search').keyup(function(){
        displayLoading();
        getMeals(`search.php?s=${$('#name-search').val()}`);
        $('.meals').show();
    })

    $('#first-letter-search').keyup(function(){
        displayLoading();
        if($('#first-letter-search').val() == ""){
            getMeals(`search.php?f=a`);
        }
        else{
            getMeals(`search.php?f=${$('#first-letter-search').val()}`);
        }
        $('.meals').show();
    })

    $('#categories').click(function(){
        displayLoading();
        $('.nav-items-details .categories').siblings().hide();
        $('.nav-items-details .categories').show();
        getCategories();
    })
    
    $('#area').click(function(){
        displayLoading();
        $('.nav-items-details .area').siblings().hide();
        $('.nav-items-details .area').show();
        getArea();
    })

    $('#ingredients').click(function(){
        displayLoading();
        $('.nav-items-details .ingredients').siblings().hide();
        $('.nav-items-details .ingredients').show();
        getIngredients();
    })

    $('#contact').click(function(){
        $('.nav-items-details .contact').siblings().hide();
        $('.nav-items-details .contact').show();
    })

    function displayLoading(){
        $('#loading').fadeIn(300);
        $('#loading').fadeOut(300);
        $('nav').css('z-index', '999999')
    }

    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[\w!@#$%^&-*\/+?]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;
    const phonePattern = /^[0-9]{10,12}$/;
    const agePattern = /^[1-9][0-9]?$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    $('#name-input').keyup(function(){
        if(namePattern.test($('#name-input').val())){
            $('#name-alert').hide();
        }
        else{
            $('#name-alert').show();
        }
    })

    $('#email-input').keyup(function(){
        if(emailPattern.test($('#email-input').val())){
            $('#email-alert').hide();
        }
        else{
            $('#email-alert').show();
        }
    })

    $('#phone-input').keyup(function(){
        if(phonePattern.test($('#phone-input').val())){
            $('#phone-alert').hide();
        }
        else{
            $('#phone-alert').show();
        }
    })

    $('#age-input').keyup(function(){
        if(agePattern.test($('#age-input').val())){
            $('#age-alert').hide();
        }
        else{
            $('#age-alert').show();
        }
    })
    $('#password-input').keyup(function(){
        if(passwordPattern.test($('#password-input').val())){
            $('#password-alert').hide();
        }
        else{
            $('#password-alert').show();
        }
    })

    $('#repassword-input').keyup(function(){
        if($('#repassword-input').val() == $('#password-input').val()){
            $('#repassword-alert').hide();
        }
        else{
            $('#repassword-alert').show();
        }
    })
    
})