<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
  <html>
<head>
    <style>
      .left{
        float:left;
      }
      .messageBody{
        border:1px solid black;
      }
    </style>
</head>
  <body>
    <h2>Sent</h2>
      <xsl:for-each select="messages/recieved">

    <div class='messageBody'>
<h2 class='left'>To:</h2>
<h2 class='left'><xsl:value-of select="user"/></h2>
<br/>
<br/>
<br/>
<br/>
<h7 class='left'>Date:</h7>
<h7 class='left'><xsl:value-of select="date"/></h7>
<br/>
<hr/>
<p><xsl:value-of select="text"/></p>
</div>
      </xsl:for-each>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>

