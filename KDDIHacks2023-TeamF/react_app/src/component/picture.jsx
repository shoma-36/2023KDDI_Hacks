import React, { useState } from "react";
import "../style/picture.css";
import AWS from "aws-sdk";

export const PictureComponent = () => {
  console.log("pic");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const albumBucketName = "";
  const bucketRegion = "";
  const IdentityPoolId = "";

  AWS.config.region = bucketRegion; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  });

  const s3 = new AWS.S3();

  // 画像データを取り込む関数
  async function fetchImageFromS3(bucketName, imageName) {
    const params = {
      Bucket: bucketName,
      Key: imageName,
    };

    try {
      const data = await s3.getObject(params).promise();
      const uint8Array = new Uint8Array(data.Body);
      const binary = String.fromCharCode.apply(null, uint8Array);
      const base64 = btoa(binary);
      const dataURL = `data:image/png;base64,${base64}`;
      if (imageName === "similar.png") {
        const imgElement = document.getElementById("target_img");
        if (imgElement) {
          imgElement.src = "";
          imgElement.src = dataURL;
        }
      } else if (imageName === "cropped.png") {
        const imgElement = document.getElementById("cropped_img");
        if (imgElement) {
          imgElement.src = "";
          imgElement.src = dataURL;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // 画像データの取得を実行する
  async function fetchData() {
    await fetchImageFromS3(albumBucketName, "cropped.png");
    await fetchImageFromS3(albumBucketName, "similar.png");
  }

  async function fetchLamda(url) {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setName(data.name);
        setComment(data.conment);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleClick() {
    await fetchLamda("");
    await fetchData();
  }

  return (
    <>
      <h2>Look Alikes !!</h2>
      <div className="name-area">
        <div id="cropped_name">切り取った顔</div>
        <div id="target_name">{name}</div>
      </div>
      <div className="img-area">
        <div>
          <img id="cropped_img" alt="kari1" />
        </div>
        <div>
          <img id="target_img" alt="kari2" />
        </div>
      </div>
      <div className="gptText-area">{comment}</div>
      <button className="btn btn-1"　onClick={handleClick}>再取得</button>
    </>
  );
};
