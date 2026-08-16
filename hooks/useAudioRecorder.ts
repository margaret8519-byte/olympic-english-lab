"use client";
import {useCallback,useEffect,useRef,useState} from "react";

type RecorderError="denied"|"missing"|"busy"|"unsupported"|null;
export function useAudioRecorder(){
 const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),chunks=useRef<Blob[]>([]),started=useRef(0),urlRef=useRef<string|null>(null);
 const [permission,setPermission]=useState<PermissionState|"unknown">("unknown"),[recording,setRecording]=useState(false),[duration,setDuration]=useState(0),[audioUrl,setAudioUrl]=useState<string|null>(null),[audioBlob,setAudioBlob]=useState<Blob|null>(null),[recordingStartedAt,setRecordingStartedAt]=useState<string|null>(null),[error,setError]=useState<RecorderError>(null);
 const cleanupStream=useCallback(()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null},[]);
 const clearAudio=useCallback(()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setAudioUrl(null);setAudioBlob(null);setRecordingStartedAt(null);setDuration(0)},[]);
 const requestPermission=useCallback(async()=>{if(!navigator.mediaDevices?.getUserMedia||!("MediaRecorder" in window)){setError("unsupported");return false}try{stream.current=await navigator.mediaDevices.getUserMedia({audio:true});setPermission("granted");setError(null);return true}catch(e){const name=e instanceof DOMException?e.name:"";setPermission(name==="NotAllowedError"?"denied":"unknown");setError(name==="NotAllowedError"?"denied":name==="NotFoundError"?"missing":"busy");return false}},[]);
 const start=useCallback(async()=>{clearAudio();if(!stream.current&&!(await requestPermission()))return;const mime=["audio/webm;codecs=opus","audio/webm","audio/mp4"].find(x=>MediaRecorder.isTypeSupported(x));const mr=new MediaRecorder(stream.current!,mime?{mimeType:mime}:undefined);chunks.current=[];mr.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data)};mr.onstop=()=>{const blob=new Blob(chunks.current,{type:mr.mimeType||"audio/webm"});const next=URL.createObjectURL(blob);urlRef.current=next;setAudioBlob(blob);setAudioUrl(next);setDuration(Math.max(1,Math.round((Date.now()-started.current)/1000)));setRecording(false);cleanupStream()};started.current=Date.now();setRecordingStartedAt(new Date(started.current).toISOString());recorder.current=mr;mr.start(250);setRecording(true);setDuration(0);},[clearAudio,cleanupStream,requestPermission]);
 const stop=useCallback(()=>{if(recorder.current?.state==="recording")recorder.current.stop();else cleanupStream()},[cleanupStream]);
 useEffect(()=>{if(!recording)return;const id=window.setInterval(()=>setDuration(Math.floor((Date.now()-started.current)/1000)),250);return()=>clearInterval(id)},[recording]);
 useEffect(()=>()=>{if(recorder.current?.state==="recording")recorder.current.stop();cleanupStream()},[cleanupStream]);
 return{permission,recording,duration,audioUrl,audioBlob,recordingStartedAt,error,requestPermission,start,stop,clearAudio};
}
