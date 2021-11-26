package de.bitgilde.TIMAAT.model;

import java.util.List;

public class DataTableInfo {

	public int draw;
	public long recordsTotal;
	public long recordsFiltered;
	
	public List<?> data;


	public DataTableInfo() {
		
	}

	public DataTableInfo(int draw, long recordsTotal, long recordsFiltered, List<?> data) {
		this.draw = draw;
		this.recordsTotal = recordsTotal;
		this.recordsFiltered = recordsFiltered;
		this.data = data;
	}

}
