'use strict'
{
    // タブメニュー
    const menuItems = document.querySelectorAll('.menu li a')
    const contents = document.querySelectorAll('.content')
    menuItems.forEach(clickedItem => {
        clickedItem.addEventListener('click', e => {
            e.preventDefault()
            // a 要素は通常画面遷移するので、e.preventDefault()とすることで画面遷移しなくなる
            menuItems.forEach(item => {
                item.classList.remove('active')
                // クリックされていない要素から active class を取り除く
            })
            clickedItem.classList.add('active')
            // クリックしたら active 要素を付ける
            contents.forEach(content => {
                content.classList.remove('active')
                // クリックされていない要素から active class を取り除く
            })
            document.getElementById(clickedItem.dataset.id).classList.add('active')
        })
    })


    // async を付けることで非同期関数と呼ばれるようになる
    // async, await で fetch を使うと Response オブジェクトが帰ってくる

    // 郵便番号による現在の天気呼び出し
    async function zipcodeApi(zipData) {
        // 実際にAPIをたたく処理
        // fetch という window オブジェクトがあらかじめ持っている関数を使う
        const res = await window.fetch("https://api.openweathermap.org/data/2.5/weather?zip=" + zipData + ",jp&appid=8f241f6e111e93a94a517a3c6477329e&lang=ja&units=metric");
        const api_ob = await res.json();
        return api_ob;
    }
    async function zipCall(zipData) {
        const apis = await zipcodeApi(zipData);
        getData(apis);
    }


    // 郵便番号による週間天気の呼び出し
    async function weekzipApi(zipData) {
        const res = await window.fetch("https://api.openweathermap.org/data/2.5/forecast?zip=" + zipData + ",jp&appid=8f241f6e111e93a94a517a3c6477329e&lang=ja&units=metric");
        const api_ob = await res.json();
        return api_ob;
    }
    async function zipweekCall(cityData) {
        const weekapis = await weekzipApi(cityData);
        getweekData(weekapis);
    }


    // 都市指定による現在の天気呼び出し
    async function cityApi(cityData) {
        const res = await window.fetch("https://api.openweathermap.org/data/2.5/weather?id=" + cityData + "&appid=8f241f6e111e93a94a517a3c6477329e&lang=ja&units=metric");
        const api_ob = await res.json();
        return api_ob;
    }
    async function cityCall(cityData) {
        const apis = await cityApi(cityData);
        getData(apis);
    }


    // 都市指定による週間天気の呼び出し
    async function weekcityApi(cityData) {
        const res = await window.fetch("https://api.openweathermap.org/data/2.5/forecast?id=" + cityData + "&appid=8f241f6e111e93a94a517a3c6477329e&lang=ja&units=metric");
        const api_ob = await res.json();
        return api_ob;
    }
    async function cityweekCall(cityData) {
        const weekapis = await weekcityApi(cityData);
        getweekData(weekapis);
    }


    // 郵便番号エラーチェック
    const error = document.getElementById('error');
    const checkError = (apis) => {
        if (apis.cod == 404) {
            error.classList.remove("hidden");
            return;
        } else {
            error.classList.add("hidden");
        }
    }


    // 指定場所の現在の天気を取得
    const places = document.getElementById("places");
    const img = document.getElementById("icon");
    const weathers = document.getElementById("weathers");
    const temp = document.getElementById("temp");
    const min_temp = document.getElementById("min_temp");
    const max_temp = document.getElementById("max_temp");
    const feel_temp = document.getElementById("feel_temp");
    const humidity = document.getElementById("humidity");
    const pressure = document.getElementById("pressure");
    const clouds = document.getElementById("clouds");
    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");
    const visibility = document.getElementById("visibility");
    const wind = document.getElementById("wind");
    const gust = document.getElementById("gust");
    const getData = (apis) => {
        checkError(apis);
        const weatherArry = apis.weather[0];
        const mainArry = apis.main;
        const sysArry = apis.sys;
        const sunriseTime = new Date(sysArry.sunrise * 1000);
        const sunsetTime = new Date(sysArry.sunset * 1000);
        const winds = apis.wind;
        const speed = `${Math.floor(winds.speed * 10) / 10} m/s`;
        const place = apis.name;
        const cloud = apis.clouds;
        const view = apis.visibility;

        places.textContent = `${place}`;
        img.src = "https://openweathermap.org/img/wn/" + weatherArry.icon + "@2x.png";
        weathers.textContent = `${weatherArry.description}`;
        temp.textContent = `${Math.floor(mainArry.temp * 10) / 10} °C`;
        min_temp.textContent = `最低 ${Math.floor(mainArry.temp_min * 10) / 10} °C`;
        max_temp.textContent = `最高 ${Math.floor(mainArry.temp_max * 10) / 10} °C`;
        feel_temp.textContent = `体感 ${Math.floor(mainArry.feels_like * 10) / 10} °C`;
        humidity.textContent = `湿度 ${Math.floor(mainArry.humidity)} %`;
        pressure.textContent = `気圧 ${Math.floor(mainArry.pressure)} hPa`;
        clouds.textContent = `雲量 ${Math.floor(cloud.all)} %`;
        sunrise.textContent = `日の出 ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`;
        sunset.textContent = `日の入り ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`;
        visibility.textContent = `視程 ${view} m`;
        if (winds.deg <= 30) {
            wind.textContent = `北風 ${speed}`;
        } else if (winds.deg <= 60) {
            wind.textContent = `北東風 ${speed}`;
        } else if (winds.deg <= 120) {
            wind.textContent = `東風 ${speed}`;
        } else if (winds.deg <= 150) {
            wind.textContent = `南東風 ${speed}`;
        } else if (winds.deg <= 210) {
            wind.textContent = `南風 ${speed}`;
        } else if (winds.deg <= 240) {
            wind.textContent = `西風 ${speed}`;
        } else if (winds.deg <= 300) {
            wind.textContent = `西風 ${speed}`;
        } else if (winds.deg <= 330) {
            wind.textContent = `西風 ${speed}`;
        } else {
            wind.textContent = `北風 ${speed}`;
        }
        if (winds.gust != undefined) {
            gust.textContent = `突風 ${winds.gust} m/s`;
        } else {
            gust.textContent = "突風情報なし";
        }
    }


    // 指定場所の3時間ごと、5日分の天気を取得
    const wrapdiv = document.createElement("div");
    const weekly = document.getElementById("weekly");
    const lists = document.getElementById("lists");
    const getweekData = (weekapis) => {
        for (let i=0; i<40; i++) {
            const div = document.createElement("div");
            const icon = weekapis.list[i].weather[0].icon;
            const daylyTime = new Date(weekapis.list[i].dt * 1000).getHours();
            // 取得データのうち24時間分のみを表示
            if (i<=8) {
                this.weekTime = document.createElement("p");
                this.weekTime.textContent = `${new Date(weekapis.list[i].dt * 1000).getHours()}時`;

                this.img = document.createElement("img");
                this.img.classList.add('weeklyimg');
                this.img.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                this.weekTemp = document.createElement("p");
                this.weekTemp.textContent = `${Math.floor(weekapis.list[i].main.temp * 10) / 10}°C`;

                this.weekHumidity = document.createElement("p");
                this.weekHumidity.textContent = `${weekapis.list[i].main.humidity}%`;

                this.weekWind = document.createElement("p");
                this.weekWind.textContent = `${Math.floor(weekapis.list[i].wind.speed * 10) / 10}m/s`;
                wrapdiv.appendChild(div);
                wrapdiv.classList.add('dayly-wrap');
                div.classList.add('dayly-weather');
                div.appendChild(this.weekTime);
                div.appendChild(this.img);
                div.appendChild(this.weekTemp);
                div.appendChild(this.weekHumidity);
                div.appendChild(this.weekWind);
                weekly.appendChild(wrapdiv);
            }
            // 取得データのうち時間が昼の12時のみを取得し表示
            if (daylyTime == 12) {
                const dateDiv = document.createElement("div");
                dateDiv.classList.add("row");
                const getDay = new Date(weekapis.list[i].dt * 1000).getDay();
                const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][getDay];
                this.weekDate = document.createElement("p");
                this.weekDate.textContent = `${dayOfWeek}曜`;
                this.weekDate.classList.add("getweekly");
                dateDiv.appendChild(this.weekDate);

                this.tomorrow = document.createElement("img");
                this.tomorrow.classList.add('weeklyimg');
                this.tomorrow.classList.add("getweekly");
                this.tomorrow.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                dateDiv.appendChild(this.tomorrow);

                this.pop = document.createElement("p");
                this.pop.textContent = `${Math.floor(weekapis.list[i].pop * 100)} %`;
                this.pop.classList.add("getweekly");
                dateDiv.appendChild(this.pop);

                this.temp = document.createElement("p");
                this.temp.textContent = `${Math.floor(weekapis.list[i].main.temp * 10) / 10}°C`;
                this.temp.classList.add("getweekly");
                dateDiv.appendChild(this.temp);

                this.humidity = document.createElement("p");
                this.humidity.textContent = `${Math.floor(weekapis.list[i].main.humidity)} %`;
                this.humidity.classList.add("getweekly");
                dateDiv.appendChild(this.humidity);
                lists.appendChild(dateDiv);
            }
        }
    }


    // 出力値のクリア
    const clearweekData = () => {
        while (wrapdiv.firstChild) {
            wrapdiv.removeChild(wrapdiv.firstChild);
        }
        while (lists.firstChild) {
            lists.removeChild(lists.firstChild);
        }
    }


    // 郵便番号の入力値の取得
    const btn = document.getElementById("btn");
    const clear = document.getElementById("clear");
    const target = document.getElementById("target");
    const target2 = document.getElementById("target2");
    // 郵便番号入力チェック
    const checkInput = () => {
        // 正規表現で入力チェック。マッチしなかったら null を返す
        if (target.value.match(/^[1-9][0-9]{2}$/) !== null) {
            target2.focus();
            if (target2.value.match(/^[0-9]{4}$/) !== null) {
                btn.classList.remove('disabled');
            }
        } else {
            btn.classList.add('disabled');
        }
    }

    // イベント

    // 郵便番号の入力中のイベント
    target.addEventListener('keyup', checkInput);
    target2.addEventListener('keyup', checkInput);
    // 郵便番号の検索ボタンをクリックした時のイベント
    btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled') == true) {
            return
        }
        const zipData = `${target.value}-${target2.value}`;
        clearweekData();
        zipCall(zipData);
        zipweekCall(zipData);
    })


    // クリアボタンをクリックした時のイベント
    clear.addEventListener('click', () => {
        location.reload();
    })


    // 都市指定のセレクトボックスで選択都市を変更して際のイベント
    const city = document.getElementById('city');
    city.addEventListener('change', () => {
        const num = city.selectedIndex;
        const cityData = city[num].value;
        clearweekData();
        cityCall(cityData);
        cityweekCall(cityData);
    })


    // ページを開いた際のイベント
    window.addEventListener('load', () => {
        const cityData = "1850144";
        cityCall(cityData);
        cityweekCall(cityData);
        target.focus();
    })


    // 天気の詳細を見る時のイベント
    const details = document.getElementById('details');
    const weatherDetails = document.getElementById('weather-details');
    details.addEventListener('click', () => {
        if (weatherDetails.classList.contains('test') == false) {
            weatherDetails.classList.add("test");
            details.textContent = "閉じる";
        } else {
            weatherDetails.classList.remove("test");
            details.textContent = "詳しく見る";
        }
    })
}