const urlToFile = async (url: string): Promise<File> => {
  const filename = url.split("/").slice(-1)[0];
  const response = await fetch(url, {
    mode: "no-cors" //임시
  });

  // const data = await response.arrayBuffer();

  const data = await response.blob();
  // const data = await fetchFileFromS3(filename);
  console.log("complete:", data, filename);
  return new File([data], filename);
};

export default urlToFile;
