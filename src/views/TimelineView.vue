<script setup lang="ts">
</script>

<template>
    <div class="container">
        <ul>
            <li>
            <span></span>
            <div class = "bd">
                <div class="title">les maths c vieux</div>
                <div class="info">bref</div>
                <div class="type">ZEJKAHFZJEEA</div>
            </div>
            <span class="number">
                <span>CECI N4A AUCUN SENS</span>
                <span>...</span>
            </span>
            </li>
            <li>
            <div class = "bd">
                <span></span>
                <div class="title">vive le golang</div>
                <div class="info">et le c++</div>
                <div class="type">vive les enfants moines boudhistes</div>
            </div>
            <span class="number">
                <span>13:00 et j'ai faim</span>
                <span>14:00 h-4:30</span>
            </span>
            </li>
            <li>
            <div class = "bd">
                <span></span>
                <div class="title">YAY</div>
                <div class="info">...css...agonie</div>
                <div class="type">le sens est mort</div>
            </div>
            <span class="number">
                <span>SSS.f</span>
                <span>17:45 (je meurt du cambridge</span>
            </span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700');
    .bd {
        height: 10vh;
        font-family: 'Open Sans', sans-serif;
        background: #86b7e7;
        
    }   
    .container ul {
        list-style: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1px 100px;
        color: #86b7e7;
        font-size: 13px;
    }
    .container ul:before {
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        border-left: 2px dashed #86b7e7;
  
    }
    .container ul li {
        position: relative;
        margin-left: 30px ;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 14px;
        border-radius: 6px;
        width: 250px;
        box-shadow: 0 0 4px rgba(0, 0, 0, .12), 0 2px 2px rgba(0, 0, 0, .08)  
    }
    .container ul li:not(:first-child) {
        margin-top: 60px;
        color:#ffffff;
    }
    .container ul li > span {
        width: 2px;
        height: 100%;
        background: #86b7e7;
        left: -30px;
        top: 0;
        position: absolute;
    }
    .container ul li > span:before, .container ul li > span:after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid #86b7e7;
        position: absolute;
        background: #86b7e7;
        left: -5px;
        top: 0;
    }
    .container ul li span:after {
        top: 100%;
    }
    .container ul li > div {
        margin-left: 10px;  
    }   
    .container div .title, .container div .type {
        font-weight: 600;
        font-size: 12px;
    }
    .container div .info {
        font-weight: 300;
    }
    .container div > div {
        margin-top: 5px;
    }
    .container span.number {
        height: 100%;
    }
    .container span.number span {
        position: absolute;
        font-size: 10px;
        left: -35px;
        font-weight: bold;
    }
    .container span.number span:first-child {
        top: 0;
    }
    .container span.number span:last-child {
        top: 100%;
    }
</style>