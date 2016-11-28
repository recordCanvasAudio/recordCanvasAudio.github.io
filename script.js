$(function(){

    var counter =0;
    // 4 images
    var image0 = "img/cat1.jpg";
    var image1 = "img/cat2.jpg";
    var image2 = "img/cat3.jpg";
    var image3 = "img/cat4.jpg";
    // array of 4 images
    var images = new Array(image0, image1, image2, image3);

    var tempTimer = 5;
    var Interval;
    function goTimer() {
        tempTimer--;
        $("#timer").text(''+tempTimer);

        if(tempTimer<=0){
            clearTimeout(Interval);
            $('img.images').show(200);
        }
    }

    //$('img.images').attr('src',images[counter]);

    var channel = 'myChannel';
    var ch_event;
    //var channelSite;
    //console.log('Channel: '+channel);

    var uuid = PUBNUB.uuid();

    var pubnub = PUBNUB.init({
        publish_key   : 'pub-c-8e45f540-691c-4e55-9f07-f2278795ec3d', // Your Pub Key
        subscribe_key : 'sub-c-b5732f80-4ccf-11e6-8b3b-02ee2ddab7fe', // Your Sub Key
        uuid: uuid,
        ssl :true
    });


    // Publish to a channel, but only
    // after we've connected from the subscriber

    $('#btn-subscribe').click(function() {

        var ch_site = $('#ch_site').val();
        ch_event = $('#ch_event').val();

        console.log(ch_site+' '+ch_event);

        var re = /.*EV+(.*)+BG.*/;
        var event_id = ch_event.replace(re, "$1");

        console.log(event_id);

        pubnub.subscribe({
            channel: ch_site,
            message: function (m) {
                console.log(m);
            },
            presence: function (m) {
                console.log('site');
                console.log(m);
                //$('div.presence').html('<h2>' + m.occupancy + '<h2>');
            },
            state: {
                user     : "broadcaster",
                status   : "on",
                event_id : event_id
            },
            connect: function (e) {
            }
        });

        pubnub.subscribe({
            channel: ch_event,
            message: function (m) {
                console.log(m);
            },
            presence: function (m) {
                console.log('ev');
                console.log(m);
                $('div.presence').html('<h2>' + m.occupancy + '<h2>');

            },
            connect: function (e) {
                /*pubnub.publish({
                 channel : channel,
                 message : 'on'
                 });*/
            }
        });
    });


    $('#quitter').click(function(){

        pubnub.unsubscribe({
            channel: channel,
            callback: function(m) {
                //console.log(m);
                /*pubnub.publish({
                    channel : channel,
                    message : 'off'
                });*/
            }
        });

    });


    $('#nextSlide').click(function(){


        $(this).text('Next');
        //$('img.images').attr('src',images[counter]);

        pubnub.publish({
            channel : channel,
            message : {
                type : 'nextSlide',
                counter : counter
            }

        });
        var qn = counter+1;
        $('img.images').hide();
        $('h1.numQuestion').html('question N° '+qn);
        $('img.images').attr('src',images[counter]);

        var attr = $('img.images').attr('src');

        if (typeof attr !== typeof undefined && attr !== false) {

            tempTimer = 5;
            Interval = setInterval(function () {
                goTimer()
            }, 1000);

            if (counter == images.length - 1) {

                $(this).attr('disabled', 'disabled');
            }

            counter++;
        }
    });



    /*$.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };*/


});
