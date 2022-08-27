/* eslint-disable no-extend-native */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useMemo } from "react";
import { useState } from 'react';

const columns = [
  { id: 'index', label: '#',align: 'left', minWidth: 10,format: (value) => value, },
  { id: 'png', label: 'Flag',align: 'center', minWidth: 100,format: (value) => <img src={value} alt="flag" height="60" width="80" />, },
  {
    id: 'name',
    label: 'Country Name',
    minWidth: 170,
    align: 'center',
    format: (value) => value,
  },
  {
    id: 'capital',
    label: 'Capital',
    minWidth: 170,
    align: 'center',
    format: (value) => value,
  },
  {
    id: 'region',
    label: 'Region',
    minWidth: 170,
    align: 'center',
    format: (value) => value,
  },
];

function createData(index,png,name,capital,region) {
  return { index,png,name,capital,region };
}


export default function StickyHeadTable({countries,selectFilter,search}) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  String.prototype.turkishtoEnglish = function () {
    return this.replace("Ğ", "g")
      .replaceAll("Ü", "u")
      .replaceAll("Ş", "s")
      .replaceAll("I", "i")
      .replaceAll("İ", "i")
      .replaceAll("Ö", "o")
      .replaceAll("Ç", "c")
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ı", "i")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c");
  };

  const filteredAll = useMemo(
    () =>selectFilter ?
      countries.filter((item) => 
        Object.keys(item).some((key)=> { 
          if(typeof item[key] == "string"){
            console.log(5)
            return item[key]
                      .toString()
                      .toLowerCase()
                     .includes(search.toLowerCase().turkishtoEnglish())
          } else if (typeof item[key] =="object"){
            console.log(75)
            if(Array.isArray(item[key])){
              console.log(item[key])
              return item[key].some(i=> typeof i == "object" ? Object.values(i).some(j=>j.toString()
              .toLowerCase()
              .includes(search.toLowerCase().turkishtoEnglish())): i.toString()
              .toLowerCase()
              .includes(search.toLowerCase().turkishtoEnglish()) )
                        
            }else{
              console.log(Object.values(item))
              return Object.values(item).some(k=>k.toString()
              .toLowerCase()
              .includes(search.toLowerCase().turkishtoEnglish()))
            }
          }
        })
      ) : countries.filter((item) => {
        return Object.keys(item).some(
          (key) =>
            key === "capital" &&
            item["capital"]
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
        );
      }),

    [selectFilter,countries,search]
  );

  const filteredCapital = useMemo(
    () =>
      countries.filter((item) => {
        return Object.keys(item).some(
          (key) =>
            key === "capital" &&
            item["capital"]
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
        );
      }),
    [search,countries]
  );
  const rows = selectFilter ?  filteredAll?.map((country, index) => {
    const {
      flags: { png },
      name,
      capital,
      region,
    } = country 
    return createData(index+1,png,name,capital,region) })
    : filteredCapital?.map((country, index) => {
        const {
          flags: { png },
          name,
          capital,
          region,
        } = country;
        return createData(index+1,png,name,capital,region) })

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '80%', overflow: 'hidden',margin:"30px auto" }}>
      <TableContainer sx={{ maxHeight: 440,border:"5px", }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' 
                            ? column.format(value)
                            : column.format(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
              rowsPerPageOptions={[5, 10, 25,50,100, rows.length]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              
            />
    </Paper>
  );
}
