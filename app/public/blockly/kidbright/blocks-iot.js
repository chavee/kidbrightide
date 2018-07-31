// =============================================================================
// publish data to gauge
// =============================================================================
Blockly.Blocks["gauge_iot"] = {
	init: function() {
		this.jsonInit({
			"type": "gauge_iot",
			"message0": Blockly.Msg.GAUGE_IOT_TITLE + " %1 %2",
			"args0": [
			  {
			    "type": "field_dropdown",
			    "name": "GAUGE_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.GAUGE_G1,
			        "G1"
			      ],
			      [
			        Blockly.Msg.GAUGE_G2,
			        "G2"
			      ]
			    ]
			  },
			  {
			    "type": "input_value",
			    "name": "VALUE",
			    "check": [
			      "Number",
			      "gauge_config"
			    ]
			  }
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": 195,
			"tooltip": Blockly.Msg.GAUGE_IOT_TOOLTIP,
  			"helpUrl": Blockly.Msg.GAUGE_IOT_HELPURL
		});
	}
};
// =============================================================================
// gauge title
// =============================================================================
Blockly.Blocks["gauge_title"] = {
	init: function(){
		this.jsonInit({
			"type": "gauge_title",
			"message0":  Blockly.Msg.GAUGE_TITLE_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_input",
			    "name": "TITLE",
			    "text": "default"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "GAUGE_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.GAUGE_G1,
			        "G1"
			      ],
			      [
			        Blockly.Msg.GAUGE_G2,
			        "G2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 195,
			"tooltip": Blockly.Msg.GAUGE_TITLE_TOOLTIP,
  			"helpUrl": Blockly.Msg.GAUGE_TITLE_HELPURL
		});
	}
};
// =============================================================================
// gauge unit
// =============================================================================
Blockly.Blocks["gauge_unit"] = {
	init: function(){
		this.jsonInit({
			"type": "gauge_unit",
			"message0": Blockly.Msg.GAUGE_UNIT_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_input",
			    "name": "UNIT",
			    "text": "default"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "GAUGE_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.GAUGE_G1,
			        "G1"
			      ],
			      [
			        Blockly.Msg.GAUGE_G2,
			        "G2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 195,
			"tooltip": Blockly.Msg.GAUGE_UNIT_TOOLTIP,
  			"helpUrl": Blockly.Msg.GAUGE_UNIT_HELPURL
		});
	}
};
Blockly.Blocks['gauge_color'] = {
	init: function(){
		this.jsonInit({
			"type": "gauge_color",
			"message0": Blockly.Msg.GAUGE_COLOR_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_colour",
			    "name": "COLOR",
			    "colour": "#cc33cc"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "GAUGE_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.GAUGE_G1,
			        "G1"
			      ],
			      [
			        Blockly.Msg.GAUGE_G2,
			        "G2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 195,
			"tooltip": Blockly.Msg.GAUGE_COLOR_TOOLTIP,
  			"helpUrl": Blockly.Msg.GAUGE_COLOR_HELPURL
		});
	}
};
// =============================================================================
// gauge min max
// =============================================================================
Blockly.Blocks["gauge_minmax"] = {
	init: function(){
		this.jsonInit({
			"type": "gauge_minmax",
			"message0": Blockly.Msg.GAUGE_MINMAX_TITLE + "%1 %2"+
						// Blockly.Msg.GAUGE_MIN_TITLE + "%3"+
						Blockly.Msg.GAUGE_MAX_TITLE + "%3",
			"args0": [
			  {
			    "type": "field_dropdown",
			    "name": "GAUGE_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.GAUGE_G1,
			        "G1"
			      ],
			      [
			        Blockly.Msg.GAUGE_G2,
			        "G2"
			      ]
			    ]
			  },
			  {
			    "type": "input_dummy"
			  },
			  // {
			  //   "type": "field_number",
			  //   "name": "MIN_VALUE",
			  //   "value": 0,
			  //   "precision": 2
			  // },
			  {
			    "type": "field_number",
			    "name": "MAX_VALUE",
			    "value": 100,
			    "precision": 2
			  }
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": 195,
			"tooltip": Blockly.Msg.GAUGE_MINMAX_TOOLTIP,
			"helpUrl": Blockly.Msg.GAUGE_MINMAX_HELPURL
		});
	}
};
// =============================================================================
// feed iot
// =============================================================================
Blockly.Blocks["feed_iot"] = {
	init: function() {
		this.jsonInit({
			"type": "feed_iot",
			"message0": Blockly.Msg.FEED_IOT_TITLE + "%1 %2",
			"args0": [
			  {
			    "type": "field_dropdown",
			    "name": "FEED_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.FIELD1,
			        "F1"
			      ],
			      [
			        Blockly.Msg.FIELD2,
			        "F2"
			      ]
			    ]
			  },
			  {
			    "type": "input_value",
			    "name": "FEED_DATA",
			    "check": [
			      "Number",
			      "gauge_config"
			    ]
			  }
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.FEED_IOT_TOOLTIP,
  			"helpUrl": Blockly.Msg.FEED_IOT_HELPURL
		});
	}
};
// =============================================================================
// gauge title
// =============================================================================
Blockly.Blocks["feed_title"] = {
	init: function(){
		this.jsonInit({
			"type": "feed_title",
			"message0":  Blockly.Msg.FEED_TITLE_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_input",
			    "name": "TITLE",
			    "text": "default"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "FEED_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.FIELD1,
			        "F1"
			      ],
			      [
			        Blockly.Msg.FIELD2,
			        "F2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.FEED_TITLE_TOOLTIP,
  			"helpUrl": Blockly.Msg.FEED_TITLE_HELPURL
		});
	}
};
// =============================================================================
// feed main title
// =============================================================================
Blockly.Blocks["feed_main_title"] = {
	init: function(){
		this.jsonInit({
			"type": "feed_main_title",
			"message0":  Blockly.Msg.FEED_MAIN_TITLE +"%1",
			"args0": [
			  {
			    "type": "field_input",
			    "name": "TITLE",
			    "text": "default"
			  },
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.FEED_MAIN_TITLE_TOOLTIP,
  			"helpUrl": Blockly.Msg.FEED_MAIN_TITLE_HELPURL
		});
	}
};
// =============================================================================
// feed unit
// =============================================================================
Blockly.Blocks["feed_unit"] = {
	init: function(){
		this.jsonInit({
			"type": "feed_unit",
			"message0": Blockly.Msg.FEED_UNIT_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_input",
			    "name": "UNIT",
			    "text": "default"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "FEED_SELECTION",
			    "options": [
			      [
			        "field1",
			        "F1"
			      ],
			      [
			        "field2",
			        "F2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.FEED_UNIT_TOOLTIP,
  			"helpUrl": Blockly.Msg.FEED_UNIT_HELPURL
		});
	}
};
// =============================================================================
// feed color
// =============================================================================
Blockly.Blocks['feed_color'] = {
	init: function(){
		this.jsonInit({
			"type": "feed_color",
			"message0": Blockly.Msg.FEED_COLOR_TITLE +"%1" + Blockly.Msg.MESSAGE_TO +"%2",
			"args0": [
			  {
			    "type": "field_colour",
			    "name": "COLOR",
			    "colour": "#cc33cc"
			  },
			  {
			    "type": "field_dropdown",
			    "name": "FEED_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.FIELD1,
			        "F1"
			      ],
			      [
			        Blockly.Msg.FIELD2,
			        "F2"
			      ]
			    ]
			  }
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.FEED_COLOR_TOOLTIP,
			"helpUrl": Blockly.Msg.FEED_COLOR_HELPURL
		});
	}
};
// =============================================================================
// feed min max
// =============================================================================
Blockly.Blocks["feed_minmax"] = {
	init: function(){
		this.jsonInit({
			"type": "feed_minmax",
			"message0": Blockly.Msg.FEED_MINMAX_TITLE + "%1 %2"+
						Blockly.Msg.FEED_MIN_TITLE + "%3"+
						Blockly.Msg.FEED_MAX_TITLE + "%4",
			"args0": [
			  {
			    "type": "field_dropdown",
			    "name": "FEED_SELECTION",
			    "options": [
			      [
			        Blockly.Msg.FIELD1,
			        "F1"
			      ],
			      [
			        Blockly.Msg.FIELD2,
			        "F2"
			      ]
			    ]
			  },
			  {
			    "type": "input_dummy"
			  },
			  {
			    "type": "field_number",
			    "name": "MIN_VALUE",
			    "value": 0,
			    "precision": 2
			  },
			  {
			    "type": "field_number",
			    "name": "MAX_VALUE",
			    "value": 100,
			    "precision": 2
			  }
			],
			"previousStatement": null,
			"nextStatement": null,
			"colour": 45,
			"tooltip": Blockly.Msg.GAUGE_MINMAX_TOOLTIP,
			"helpUrl": Blockly.Msg.GAUGE_MINMAX_HELPURL
		});
	}
};
