import React, { useReducer, useRef, useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlay, faClock, faPause, faShuffle, faVolumeXmark, faVolumeLow, faVolumeHigh, faMusic, faBackward, faForward  } from '@fortawesome/free-solid-svg-icons';

import {songsData} from './songs';
import './style.css'
export default function MusicPlayer () {
    const audioref=useRef(null);
    const [duration, setduration]=useState(0);
    const [time, setTime]=useState(0);
    const [isplaying, setisplaying]=useState(false);
    const [songs, setsonglist]=useState(songsData);
    const[volumeicon, setvolumeicon]=useState(faVolumeLow);
    const [timer, settimer]=useState(45);
    const [showtimer, setshowtimer]=useState(false);

    //logic for Timer
    useEffect(() => {
        if ( timer > 0) {
            const timerId = setTimeout(() => {
            audioref.current.pause();
            setisplaying(false);
          }, timer * 60 * 1000);
          return () => clearTimeout(timerId);
        }
      }, [timer]);

      //For Rotating Logo
      useEffect(() => {
        const logoElement = document.getElementById('logo');
    
        if (isplaying) {
            logoElement.classList.add('rotatelogo');
        } else {
            logoElement.classList.remove('rotatelogo');
        }
    }, [isplaying]);


    function reducer(state, action) {
        switch (action.type) {
            case "prev":
                return{ current: state.current ===0?songs.length-1:state.current-1}
            case "next":
                return{ current: state.current===songs.length-1?0:state.current+1}
            case  "choosen":
                setisplaying(true);
                audioref.current.autoplay=true;
                return{current: action.index}

            case "initialize":
                if(audioref.current.paused){
                    setisplaying(false);
                }else{
                    setisplaying(true);
                }
                setisplaying(true);
                return {current: 0};
            default:
                return state;
        }
    }

    

    const [state, dispatch] = useReducer(reducer, { current: 0 });

    //prev Button
    const handlePrev = () => {
        audioref.current.autoplay=true;
        setisplaying(true);
        dispatch({ type: "prev" });
    };

    //next button
    const handleNext = () => {
        audioref.current.autoplay=true;
        setisplaying(true);
        dispatch({ type: "next" });
    };

    //play pause
    const handleplay=()=>{

        if(audioref.current.paused){
            audioref.current.play();
            setisplaying(true);
        }
        else{
            audioref.current.pause();
            setisplaying(false);
        }
    }

    //When auto ended
    const handleedning=()=>{
        setisplaying(true);
        audioref.current.autoplay=true;
        dispatch({type:"next"});
    }

    //handle Volume control
    const handlevolume=(e)=>{
        const temp=e.target.value;
        audioref.current.volume=(e.target.value/100);
       if(temp>50){
        setvolumeicon(faVolumeHigh);
       }
       if(temp===0)
        setvolumeicon(faVolumeXmark);
       if(temp<50 && temp>0)
        setvolumeicon(faVolumeLow)
    }

    //handle audio Time
    const handletime=()=>{

        setTime(parseInt(audioref.current.currentTime));
    }

    //handle song time
    const handlesong=(e)=>{
        const time=e.target.value;
        audioref.current.currentTime=time;
    }

    //handle duration of song
    const handledata=()=>{
        setduration(audioref.current.duration)
    }

    //handle suffling
    const handlesuffle=()=>{
        songs.sort(() => Math.random() - 0.5)
        setsonglist(songs);
        handleNext();
    }

    //handle Choosing from the Playlist
    const handlelist=(i)=>{
        dispatch({type:"choosen", index:i})

    }

    const handletimer=()=>{
        setshowtimer(!showtimer);
        settimer(45);
    }

    const handleshowtimer=(e)=>{
        settimer(e.target.value);
    }

    return (
        <>
            <div className="container">
                <div className="box">

                    <div className="left">
                        <h1><FontAwesomeIcon icon={faBars}/> Playlist
                        <select className="sort" onChange={handlesort} defaultValue="sort By">
                            <option  hidden>sort By</option>
                            <option >A-Z</option>
                            <option >Z-A</option>
                            <option >Favourate</option>
                        </select>
                        <span onClick={handletimer}>
                            <FontAwesomeIcon icon={faClock}/></span>
                            </h1>
                        <div className="slider">
                        {showtimer &&  <input className="timer" onChange={handleshowtimer} type="range" min="0" max="90"/> } 
                        {showtimer&& <p>{timer}</p>} 
                        </div>
                        <Playlist />
                    </div>


                    <div className="right">
                        <div className="top">
                            <h1>{songs[state.current].title}</h1>
                            <p>{songs[state.current].singer}</p>
                        </div>
                        <div className="middle" id='logo'>
                        <img src={songs[state.current].img} alt=""/>

                        </div>
                        <div className="bottom">
                            <button className="shufflebutton" onClick={handlesuffle}><FontAwesomeIcon icon={faShuffle}/></button>

                            <input className="volumeinput" onChange={handlevolume} type="range" min="0" default="50" max="100"/>

                            <FontAwesomeIcon className="volumeicon"icon={volumeicon} />

                            <p className="time" >{`${parseInt(time/60)}:${time%60}`}</p>

                            <p className="duration" >{`${parseInt(duration /60)}:${parseInt(duration%60)}`}</p>

                            <input className="songrange"onChange={handlesong} type="range" min="0" value={time} max={duration}/>

                        <div className="controls">
                            <Star songs={songs}/>
                            <button className="prev"onClick={handlePrev}><FontAwesomeIcon icon={faBackward}/></button>
                            <button className="play" onClick={handleplay}><FontAwesomeIcon  icon={isplaying?faPause:faPlay}/></button>
                            <button className="next" onClick={handleNext}><FontAwesomeIcon  icon={faForward}/></button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <audio
              ref={audioref} 
              onLoadedMetadata={handledata} 
              onTimeUpdate={handletime} 
              className="reactplayer" 
              onEnded={handleedning}
              controls src={songs[state.current].src}>
        </audio>
        </>
    );

    function Playlist(){
        return (
            <ul>
            { songs.map((e, i)=>{
                    return(
                        <li key={i} onClick={()=>{handlelist(i)}}>{e.title}
                        {state.current===i && <FontAwesomeIcon className="playstatus"icon={faMusic}/>}
                        </li>     
                    )
                })}
            </ul>
        )
    }
    function handlesort(e){
        if (e.target.value === "A-Z") {
            setsonglist(songsData);
            setsonglist((songs)=>{
                return songs.sort((a, b)=>{
                    return a.title.localeCompare(b.title);
                })  
            })
            dispatch({type: "initialize"});
            }
        else if (e.target.value === "Favourate") {
            setsonglist((songs)=>{
                return songs.filter((song)=>{
                return song.favourate;
                })
            })
                dispatch({type: "initialize"});
        }
        else if(e.target.value==="Z-A"){
            setsonglist(songsData);
            setsonglist((songs)=>{
                return songs.sort((a, b)=>{
                    return b.title.localeCompare(a.title);
                })  
            })
            dispatch({type: "initialize"});
        }
    }

    function Star({songs}){
       return (
        (
            songs[state.current].favourate ? (
             <svg
                    onClick={handlefavourate}
                    className="star"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#000"
                    stroke="black"
                    >
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                    </svg>
    
            ):(
                <svg
                onClick={handlefavourate}
                className="star"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="{2}"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            )
        )
       )
    }

    function handlefavourate(){
        songsData[state.current].favourate=!songsData[state.current].favourate;
        setsonglist(songsData);
    }
}
