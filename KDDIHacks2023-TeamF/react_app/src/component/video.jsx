import { React, useState, useEffect } from "react";
import AWS from "aws-sdk";

export const VideoComponent = (props) => {
  let width = (window.innerWidth / 3) * 2; //get the window width
  let height = 0; //this will be computed based on the input stream
  let streaming = false; //streaming reference
  let video = null; //video reference
  let canvas = null; //canvas referance
  let device = null;

  useEffect(() => {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    device = document.getElementById("device");
    if (isSmartPhone()) {
      //device.innerText = "Smart Phone";
    } else {
      //device.innerText = "PC";
    }

    //this event is fired when the video can ready to stream.(a.k.a: video can play)
    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          width = window.innerWidth / 2; //get window width
          height = video.videoHeight / (video.videoWidth / width);
          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );

    //this event is fired when the file uploaded.(a.k.a: file change)
    clearPhoto();
    cameraOn();
  });

  async function cameraOn() {
    let stream = null; //variable to preserve the video result.
    let constraints = null;
    if (isSmartPhone()) {
      // setting constraints
      constraints = {
        audio: false,
        video: {
          facingMode: "user",
        },
      };
    } else {
      constraints = {
        audio: false,
        video: true, // this code is too short. should be more detailed.
      };
    }
    // get the references.
    const video = document.getElementById("video");
    // get UserMedia status and stream from camera, and play video.
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.play();
    } catch (err) {
      console.log(err);
    }
  }

  function takePicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      const data = canvas.toDataURL("image/png");

      let bin = atob(data.replace(/^.*,/, "")); // (1)ファイルをバイナリ化
      let buffer = new Uint8Array(bin.length); // (2)バイナリデータに変換する
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      // (3)Fileオブジェクトを生成
      let image_file = new File([buffer.buffer], "hack_test.png", {
        type: "image/png",
      });
      addPhoto(image_file);
      // photo.setAttribute("src", data);
      document.getElementById("canvas").style.display = "none";
    } else {
      clearPhoto();
    }
  }

  function addPhoto(file) {
    var albumBucketName = "";
    var bucketRegion = "";
    var IdentityPoolId = "";

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });

    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: albumBucketName },
    });
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent("");

    var photoKey = albumPhotosKey + fileName;

    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
      },
    });
    var promise = upload.promise();
    promise.then(
      function (data) {
        alert("Successfully uploaded photo.");
        props.setIsView(true);
      },
      function (err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    );
  }

  function randomFileName() {
    return Math.random().toString(32).substring(2) + ".jpg";
  }

  function isSmartPhone() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
  }

  function clearPhoto() {
    if (canvas) {
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/png");
    }
  }

  async function uploadFile(file) {
    const albumBucketName = "face-image-teamf";
    const bucketRegion = "ap-northeast-1";
    const IdentityPoolId =
      "ap-northeast-1:27df68ca-3e55-4ff2-8ad5-01216bfbb9c6";

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });

    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent("faceImage") + "/";

    var photoKey = albumPhotosKey + fileName;

    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
      },
    });

    var promise = upload.promise();

    promise.then(
      function (data) {
        alert("Successfully uploaded photo.");
      },
      function (err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    );
  }

  return (
    <>
      <div className="d-flex p-2 justify-content-around align-items-center">
        <div>
          <span style={{ margin: "0 20px" }}></span>
          <button type="button" className="btn btn-1" onClick={takePicture}>
            Upload Picture
          </button>
        </div>
      </div>
    </>
  );
};
