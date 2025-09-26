    //<![CDATA[
    $(document).ready(function(){
       $("#shadow").css("height", $(document).height()).hide();
       $(".light").click(function(){
          $("#shadow").toggle();
             if ($("#shadow").is(":hidden"))
                $(this).html("<i class='far fa-lightbulb' aria-hidden='true'></i> <span>Turn Off Light</span>").removeClass("turnedOff");
             else
                $(this).html("<i class='fas fa-lightbulb' aria-hidden='true'></i> <span>Turn On Light</span>").addClass("turnedOff");
             });

      });
    //]]>
    
