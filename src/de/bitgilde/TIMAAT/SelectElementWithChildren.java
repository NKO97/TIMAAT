package de.bitgilde.TIMAAT;

import java.util.List;

public class SelectElementWithChildren {
  public String text;

	public List<SelectElement> children;

  public SelectElementWithChildren(String text, List<SelectElement> children) {
    this.text = text; 
    this.children = children;
  };

  // public String getText() {
  //   return text;
  // }

  // public void setText(String text) {
  //   this.text = text;
  // }
}
