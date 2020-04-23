package de.bitgilde.TIMAAT.model;

import java.util.List;

public class DatatableInfo {

	public int draw;
	public long recordsTotal;
	public long recordsFiltered;
	
	public List<?> data;


	public DatatableInfo() {
		
	}

	public DatatableInfo(int draw, long recordsTotal, long recordsFiltered, List<?> data) {
		this.draw = draw;
		this.recordsTotal = recordsTotal;
		this.recordsFiltered = recordsFiltered;
		this.data = data;
	}

}
