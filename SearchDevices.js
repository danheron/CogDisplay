// Start scanning
packets=50;
NRF.setScan(function(d) {
  packets--;
  if (packets<=0)
    NRF.setScan(); // stop scanning
  else
    console.log(d); // print packet info
});
